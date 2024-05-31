import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/globalProvider";
import { getUserLikedPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Home = () => {
    const { user } = useGlobalContext();

    const { data: posts, refetch } = useAppwrite(() =>
        getUserLikedPosts(user.$id)
    );

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="flex px-4 my-6 space-y-6">
                        <View className="flex flex-row items-start justify-between mb-6">
                            <View>
                                <Text className="text-2xl text-white font-psemibold">
                                    Saved Videos
                                </Text>
                            </View>
                        </View>

                        <SearchInput />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Saved Videos Found"
                        subtitle="No videos created yet"
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};
export default Home;
