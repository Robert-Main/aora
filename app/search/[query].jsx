import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams } from "expo-router";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Search = () => {
    const { query } = useLocalSearchParams();
    const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

    useEffect(() => {
        refetch();
    }, [query]);

    return (
        <SafeAreaView className="h-full bg-primary">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <>
                        <View className="flex px-4 my-6">
                            <Text className="text-sm text-gray-100 font-pmedium">
                                Search Results
                            </Text>
                            <Text className="mt-1 text-2xl text-white font-psemibold">
                                {query}
                            </Text>

                            <View className="mt-6 mb-8">
                                <SearchInput
                                    initialQuery={query}
                                    refetch={refetch}
                                />
                            </View>
                        </View>
                    </>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos found for this search query"
                    />
                )}
            />
        </SafeAreaView>
    );
};
export default Search;
