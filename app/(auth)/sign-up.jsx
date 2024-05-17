import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, router } from "expo-router";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";

const SignUp = () => {
    const { setUser } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const submit = async () => {
        if (!form.username || !form.password || !form.email) {
            Alert.alert("Error", "Please fill in all fields");
        }
        setIsSubmitting(true);
        try {
            const result = await createUser(
                form.email,
                form.password,
                form.username
            );

            setUser(result);
            router.replace("/home");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <SafeAreaView className="flex items-center justify-center h-full bg-primary">
            <ScrollView>
                <View
                    className="flex items-center !justify-center w-full h-full px-4 my-6"
                    style={{}}
                >
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[34px]"
                    />

                    <Text className="mt-10 text-2xl font-semibold text-white font-psemibold">
                        Sihg up to Aora
                    </Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) =>
                            setForm({ ...form, username: e })
                        }
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        handlePress={submit}
                        containerStyles="mt-7 w-full"
                        isLoading={isSubmitting}
                        title="Sign up"
                    />

                    <View className="flex flex-row justify-center gap-2 pt-5">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Have an account already?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signin
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
