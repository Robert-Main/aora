import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

import { router } from "expo-router";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/globalProvider";
import { createVideoPost } from "../../lib/appwrite";

const Create = () => {
    const { user } = useGlobalContext();
    const { uploading, setUpoading } = useState(false);
    const [form, setForm] = useState({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
    });

    const openPicker = async (selectType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type:
                selectType === "image"
                    ? ["image/jpg", "image/jpeg", "image/png"]
                    : ["video/mp4", "video/gif"],
        });
        if (!result.canceled) {
            if (selectType === "image") {
                setForm({ ...form, thumbnail: result.assets[0] });
            }
            if (selectType === "video") {
                setForm({ ...form, video: result.assets[0] });
            }
        }
    };

    const submit = async () => {
        if (!form.title || !form.video || !form.prompt) {
            Alert.alert("Error", "Please fill in all fields");
        }
        setUpoading(true);
        try {
            await createVideoPost({
                ...form,
                userId: user.$id,
            });
            Alert.alert("Success", "post uploaded successfully");
            router.push("/home");
        } catch (error) {
            Alert.alert("Error", error.message);
            // setUpoading(false);
        } finally {
            setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: "",
            });
            setUpoading(false);
        }
    };

    return (
        <SafeAreaView className="h-full bg-primary">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-center text-white font-psemibold">
                    Upload Video
                </Text>

                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a catchy title..."
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />

                <View className="space-y-2 mt-7">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className="w-full h-64 rounded-2xl"
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                            />
                        ) : (
                            <View className="flex items-center justify-center w-full h-40 px-4 border bg-black-100 rounded-2xl border-black-200">
                                <View className="flex items-center justify-center border border-dashed w-14 h-14 border-secondary-100">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        alt="upload"
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="space-y-2 mt-7">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode="cover"
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="flex flex-row items-center justify-center w-full h-16 px-4 space-x-2 border-2 bg-black-100 rounded-2xl border-black-200">
                                <Image
                                    source={icons.upload}
                                    resizeMode="contain"
                                    alt="upload"
                                    className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title="AI Prompt"
                    value={form.prompt}
                    placeholder="The AI prompt of your video...."
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-7"
                />

                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Create;

const styles = StyleSheet.create({});
