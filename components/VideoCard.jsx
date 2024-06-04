import { ResizeMode, Video } from "expo-av";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";
import { useVideoPlayback } from "../context/VideoPlaybackProvider";
import { useGlobalContext } from "../context/globalProvider";
import { likePost } from "../lib/appwrite";

const VideoCard = ({
    video: {
        title,
        thumbnail,
        video,
        creator: { username, avatar },
        $id: postId,
        likes,
    },
}) => {
    const { user } = useGlobalContext();
    const { currentVideo, setCurrentVideo } = useVideoPlayback();
    const [play, setPlay] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const initialLikes = Array.isArray(likes) ? likes : [];
        if (initialLikes.includes(user.$id)) {
            setLiked(true);
        }
    }, [likes, user.$id]);

    const toggleLike = async () => {
        try {
            const updatedPost = await likePost(postId, user.$id);
            setLiked(updatedPost.likes.includes(user.$id));
        } catch (error) {
            console.error("Failed to like the post", error);
        }
    };

    const togglePlay = () => {
        if (currentVideo === postId) {
            setPlay(false);
            setCurrentVideo(null);
        } else {
            setPlay(true);
            setCurrentVideo(postId);
        }
    };

    useEffect(() => {
        if (currentVideo !== postId) {
            setPlay(false);
        }
    }, [currentVideo, postId]);

    return (
        <View className="flex flex-col items-center px-4 mb-14">
            <View className="flex flex-row items-start gap-3">
                <View className="flex flex-row items-center justify-center flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>

                    <View className="flex justify-center flex-1 ml-3 gap-y-1">
                        <Text
                            className="text-sm text-white font-psemibold"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {username}
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row items-center justify-between gap-4 pt-2">
                    <TouchableOpacity onPress={toggleLike}>
                        <Image
                            source={icons.eye}
                            style={{ tintColor: liked ? "red" : "white" }}
                            className="w-8 h-8"
                        />
                    </TouchableOpacity>
                    <Image
                        source={icons.menu}
                        className="w-5 h-5"
                        resizeMode="contain"
                    />
                </View>
            </View>

            {play ? (
                <Video
                    source={{ uri: video }}
                    className="w-full mt-3 h-60 rounded-xl"
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            setPlay(false);
                            setCurrentVideo(null);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={togglePlay}
                    className="relative flex items-center justify-center w-full mt-3 h-60 rounded-xl"
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full mt-3 rounded-xl"
                        resizeMode="cover"
                    />
                    <Image
                        source={icons.play}
                        className="absolute w-12 h-12"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default VideoCard;
