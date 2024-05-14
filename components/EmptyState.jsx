import { router } from "expo-router";
import { Image, Text, View } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }) => {
    return (
        <View className="flex items-center justify-center px-4">
            <Image
                source={images.empty}
                resizeMode="contain"
                className="w-[270px] h-[216px]"
            />

            <Text className="text-sm text-gray-100 font-pmedium">{title}</Text>
            <Text className="mt-2 text-xl text-center text-white font-psemibold">
                {subtitle}
            </Text>

            <CustomButton
                title="Back to Explore"
                handlePress={() => router.push("/home")}
                containerStyles="w-full max-w-[300px] my-5"
            />
        </View>
    );
};

export default EmptyState;
