import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import InfoBox from "../../components/infoBox";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/globalProvider";
import { getUserPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Profile = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();

    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

    const logout = async () => {
        await sigOut();
        setUser(null);
        setIsLogged(false);
        router.replace("/sign-in");
    };

    return (
        <SafeAreaView className="h-full bg-primary">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos found for this search query"
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex items-center justify-center w-full px-4 mt-6 mb-12">
                        <TouchableOpacity
                            onPress={logout}
                            className="flex items-end w-full mb-10"
                        >
                            <Image
                                source={icons.logout}
                                resizeMode="contain"
                                className="w-6 h-6"
                            />
                        </TouchableOpacity>

                        <View className="flex items-center justify-center w-16 h-16 border rounded-lg border-secondary">
                            <Image
                                source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                            />
                        </View>

                        <InfoBox
                            title={user?.username}
                            containerStyles="mt-5"
                            titleStyles="text-lg"
                        />

                        <View className="flex flex-row mt-5">
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                titleStyles="text-xl"
                                containerStyles="mr-10"
                            />
                            <InfoBox
                                title="1.2k"
                                subtitle="Followers"
                                titleStyles="text-xl"
                            />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};
export default Profile;
