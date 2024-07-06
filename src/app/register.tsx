import { useState } from "react";
import { View, Image, StatusBar, Alert } from "react-native";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons"
import { Link, router } from "expo-router"

import { Input } from "@/components/input"
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";

import { api } from "@/server/api"
import axios, { isAxiosError } from "axios";

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33"
                
export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleResgister() {
        try {
        if(!name.trim() || !email.trim()) {
            return Alert.alert("Inscrição", "Preencha todos os campos!")
        }

        setIsLoading(true)

        const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, { 
            name, 
            email,
         })

        if (registerResponse.data.attendeeId) {
            Alert.alert("Inscrição", "Inscrição realizada com sucesso!", [
                { text: "OK", onPress: () => router.push("/ticket")}
            ])
        }

        } catch (error) {
            console.log(error)

            if (isAxiosError(error)) {
                if(String(error.response?.data.message).includes("already registered")) {
                    return Alert.alert("Inscrição", "Este e-mail já está cadastrado!")
                }
            }

            Alert.alert("Inscrição", "Não foi possível realizar a incrição")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-green-500 items-center justify-center p-8">
                    <StatusBar barStyle="light-content"/>
            <Image 
             source={require("@/assets/ticket/Logo.png")}
              className="h-16"
              resizeMode="contain"
            />
            <View className="w-full mt-12 gap-3">

                <Input>
                    <FontAwesome6
                        name="user-circle"
                        color={colors.green[200]}
                        size={20}
                    />
                    <Input.Field placeholder="Nome completo" onChangeText={setName}/>
                </Input>

                <Input>
                    <MaterialIcons
                        name="alternate-email"
                        color={colors.green[200]}
                        size={20}
                    />
                    <Input.Field placeholder="E-mail" keyboardType="email-address" onChangeText={setEmail}/>
                </Input>

                <Button title="Realizar inscrição"
                onPress={handleResgister}
                isLoading={isLoading}
                />

                <Link href="/"
                    className="text-gray-100 text-base font-bold text-center mt-8"
                >
                    Já possui ingresso?
                </Link>
            </View>
        </View>
    )
}