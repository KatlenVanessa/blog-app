import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import dateFormat, { masks } from "dateformat";
import Markdown from "react-native-markdown-display";
import * as Linking from "expo-linking";
import RelatedPosts from "./RelatedPosts";
import Separator from "./Separator";
import { getSinglePost } from "../api/post";

const windowWidth = Dimensions.get("window").width;

const { width } = Dimensions.get("window");

const PostDetail = ({ route, navigation }) => {
  const post = route.params?.post;

  const rules = {
    paragraph: (node, children, parent, styles) => (
      <Text key={node.key} style={styles.paragraph} selectable>
        {children}
      </Text>
    ),
  };

  const handleSinglePostFetch = async (slug) => {
    const { error, post } = await getSinglePost(slug);

    if (error) {
      return console.log(error);
    }
    navigation.push("PostDetail", { post });
  };

  const handleOnLinkPress = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erro ao abrir o link", "Não foi possível abrir a URL");
    }
  };

  if (!post) {
    return null;
  }

  const getImage = (uri) => {
    if (uri) return { uri };
    return require("../../assets/icon.png");
  };

  const { title, thumbnail, tags, createdAt, author, content } = post;

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "700",
            color: "black",
            fontSize: windowWidth < 400 ? 20 : 28,
            marginTop: 30,
            padding: windowWidth * 0.05,
          }}
        >
          {title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: windowWidth * 0.05,
            paddingBottom: windowWidth * 0.05,
          }}
        >
          <Text
            selectable
            style={{
              color: "black",
              fontSize: windowWidth * 0.04,
            }}
          >
            Tags
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {tags.map((tag, index) => (
              <Text
                style={{
                  marginLeft: 5,
                  color: "grey",
                  fontSize: windowWidth * 0.04,
                }}
                key={tag + index}
              >
                #{tag}
              </Text>
            ))}
          </View>
        </View>

        <Image
          source={getImage(thumbnail)}
          style={{ width: "100%", aspectRatio: 16 / 9 }} // 16:9 é uma proporção de exemplo, você pode ajustá-la
          resizeMode="cover" // Pode usar 'contain' se preferir manter a imagem completamente visível
        ></Image>
      </View>

      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          {/* <Text style={{ color: "D3756B" }}>By {author}</Text> */}
          <Text
            style={{
              color: "grey",
              fontSize: windowWidth * 0.04,
              paddingTop: windowWidth * 0.05,
              paddingBottom: windowWidth * 0.05,
              paddingLeft: windowWidth * 0.7,
            }}
          >
            {dateFormat(createdAt, "mediumDate")}
          </Text>
        </View>

        <Markdown
          //rules={rules}
          style={styles}
          onLinkPress={handleOnLinkPress}
        >
          {content}
        </Markdown>
      </View>

      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "black",
            fontSize: 22,
          }}
        >
          Artigos Relacionados
        </Text>
        <Separator width="100%"></Separator>
        <RelatedPosts
          postId={post.id}
          onPostPress={handleSinglePostFetch}
        ></RelatedPosts>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    lineHeight: 22,
    color: "black",
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 16,
  },
  link: {
    color: "grey",
  },
  list_item: {
    color: "grey",
    paddingVertical: 5,
  },
});

export default PostDetail;
