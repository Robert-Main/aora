import { Link, router } from "expo-router";
import { Alert, Dimensions, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/globalProvider";
import { getCurrentUser, signIn } from "../../lib/appwrite";

const SignIn = () => {
    const [isSubmitting, setSubmitting] = useState(false);
    const { setUser, setIsLogged } = useGlobalContext();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill in all fields");
        }

        setSubmitting(true);

        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            setUser(result);
            setIsLogged(true);

            Alert.alert("Success", "User signed in successfully");
            router.replace("/home");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="h-full bg-primary">
            <ScrollView>
                <View
                    className="flex items-center justify-center w-full h-full px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[34px]"
                    />

                    <Text className="mt-10 text-2xl font-semibold text-white font-psemibold">
                        Log in to Aora
                    </Text>

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
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7 w-full"
                        isLoading={isSubmitting}
                    />

                    <View className="flex flex-row justify-center gap-2 pt-5">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
