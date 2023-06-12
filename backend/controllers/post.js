const Post = require('../models/post');
const FeaturedPost = require('../models/featuredPost');
const cloudinary = require('../cloud');
const { isValidObjectId } = require('mongoose');

const FEATURED_POST_COUNT = 4;

const addToFeaturedPost = async (postId) => {
    const isAlreadyExists = await Post.findOne({post: postId});
    
    if(isAlreadyExists) return;

    const featuredPost = new FeaturedPost({post: postId});
    await featuredPost.save();

    const featuredPosts = await FeaturedPost.find({}).sort({createAt: -1});

    featuredPosts.forEach(async(post, index) => {
        if(index >= FEATURED_POST_COUNT){
            await FeaturedPost.findByIdAndDelete(post._id); //Não funciona
        }
    });
};


const removeFromFeaturedPost = async (postId) => {
    await FeaturedPost.findOneAndDelete({post : postId});
};

exports.createPost = async (req, res) => {
    const {title, content, meta, tags, author, slug, featured} = req.body;
    const {file} = req;
    const isAlreadyExists = await Post.findOne({slug});
    
    if(isAlreadyExists) return res.status(401).json({error: 'Please use unique slug'});

    const newPost =  new Post({title, content, meta, tags, author, slug});

    if (file) {
       const {secure_url: url, public_id} = await cloudinary.uploader.upload(file.path)
       newPost.thumbnail = {url, public_id}
        
    }

    await newPost.save();

    if (featured) {
        await addToFeaturedPost(newPost._id)
    }

    res.json({post: 
        {   id: newPost._id,
            title, 
            meta,
            slug,
            thumbnail: newPost.thumbnail?.url, 
            author: newPost.author,},});

};


exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
        return res.status(401).json({error: 'Invalid request!'});
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({error: 'Post not found'});
    }

    const public_id = post.thumbnail?.public_id;
    if (public_id) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !=='ok') {
            return res.status(404).json({error: 'Cloud not remove thumbnail'});
        }
    }
    
    await Post.findByIdAndDelete(postId);
    res.json({message: 'Post removed successfully!'});
};

exports.updatePost = async (req, res) => {
    const {title, content, meta, tags, author, slug, featured} = req.body;
    const {file} = req;
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
        return res.status(401).json({error: 'Invalid request!'} );
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({error: 'Post not found'});
    }

    const public_id = post.thumbnail?.public_id;
    if (public_id && file) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== 'ok') {
            return res.status(404).json({error: 'Cloud not remove thumbnail!'});
        }
    }

    if(file){
        const {secure_url: url, public_id} = await cloudinary.uploader.upload(file.path);
        post.thumbnail = {url, public_id};
    }
    
    post.title = title;
    post.meta = meta;
    post.content = content;
    post.slug = slug;
    post.author = author;
    post.tags = tags;

    if (featured) {
        await addToFeaturedPost(postId);
    }
    else{
        await removeFromFeaturedPost(postId);
    }
    
    await post.save();
    res.json({ 
        post:{ 
            id: post._id,
            title, 
            meta,
            slug,
            content,
            thumbnail: post.thumbnail?.url,   
            author: post.author, 
            featured,
        },
    });


};

exports.getPost = async (req, res) =>  {//FALTA ISSO

}
