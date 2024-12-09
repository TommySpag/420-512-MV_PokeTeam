import { Image, StyleSheet, Text, View, TextInput, Dimensions, KeyboardAvoidingView, ActivityIndicator, ScrollView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { colorsPalette } from '../../assets/colorsPalette'
import { TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { signIn } from '../../lib/axios'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context'


const WIDTH_BTN = Dimensions.get('window').width - 56

const signin = () => {

  const router = useRouter()
  const { theme } = useTheme()
  const [alertIdentifier, setAlertIdentifier] = useState(false)
  const [alertMDP, setAlertMDP] = useState(false)
  const [msgErreur, setMsgErreur] = useState("")
  const [loading, setLoading] = useState(false)
  const colors = colorsPalette[theme]
  const text = "Connectez-vous";


  const [form, setForm] = useState({ usernameOrEmail: "", password: "" })

  const submit = async () => {

    if (form.usernameOrEmail == "" || form.password == "") {
      if (form.usernameOrEmail == "") {
        setAlertIdentifier(true)
        if (form.password == "") {
          setAlertMDP(true)
        }
        else {
          setAlertMDP(false)
        }
      }
      else {
        setAlertIdentifier(false)
        setAlertMDP(true)
      }
      return null
    }

    console.log(`Trying to signIn with usernameOrEmail : ${form.usernameOrEmail} and password : ${form.password}`)

    try {
      setLoading(true)
      const result = await signIn(form.usernameOrEmail, form.password)
      setLoading(false)
      setForm({ usernameOrEmail: "", password: "" })
      router.push(`../${result.id}/profile`)

    } catch (error) {
      setLoading(false)
      if (error.message == "AxiosError: Request failed with status code 401") {
        setMsgErreur("Identifiant ou mot de passe incorrect")
      }
      else {
        setMsgErreur("Désolé : Il y a un problème de notre côté, veuillez réessayer plus tard.")
      }
      console.log("Error : ", error.message)
    }

  }
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-evenly items-center"
      style={[{ backgroundColor: colors.background_c1 }]}
    >
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>

          <Image className="width" style={styles.image}
            source={require('/root/420-512-MV_PokeTeam/PokeTeam_FE/assets/images/poketeamlogo.jpg')}
          />
          <View className="flex-1 justify-center items-center gap-8" >
            <Text style={styles.text}>
              {text.split('').map((letter, index) => (
                <View key={index} style={styles.letterContainer}>
                  <Text style={styles.letter}>{letter}</Text>
                </View>
              ))}
            </Text>
            {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}

            {!msgErreur == "" ?
              <View
                className="items-center justify-center py-5 rounded-lg border-2" style={[{ width: WIDTH_BTN, color: colors.text, backgroundColor: colors.lightAlert, borderColor: colors.alert }]}
              >
                <Text className="text-md" style={{ color: colors.alert }}>{msgErreur}</Text>
              </View>
              : null
            }

            <View>
              <View className="flex-row items-center">
                <TextInput
                  className="justify-center py-5 rounded-lg text-center"
                  style={[{ color: colors.text, backgroundColor: colors.background, width: WIDTH_BTN }, alertIdentifier ? { paddingRight: 56, borderWidth: 2, borderColor: colors.alert } : {}]}
                  onChangeText={(item) => { setForm({ ...form, usernameOrEmail: item }) }}
                  placeholder="Entrez l'identifiant"
                  placeholderTextColor={colors.secondary}
                  value={form.usernameOrEmail}
                />
                {alertIdentifier ? <Icon className="absolute right-4" name="exclamation-triangle" size={30} color={colors.alert} /> : null}
              </View>

              <View className="justify-end items-end" style={{ width: WIDTH_BTN }} >
                <Link href="./recovery">
                  <Text style={{ color: colors.black }}>Identifiant oublié?</Text>
                </Link>
              </View>
              {alertIdentifier ? <Text className="pt-1" style={{ color: colors.alert }}>Identifiant : Ce champs doit être rempli</Text> : null}
            </View>
            <View>
              <View className="flex-row items-center" >
                <TextInput
                  className="justify-center py-5 rounded-lg text-center"

                  style={[{ width: WIDTH_BTN, color: colors.text, backgroundColor: colors.background }, alertMDP ? { paddingRight: 56, borderWidth: 2, borderColor: colors.alert } : {}]}
                  onChangeText={(item) => { setForm({ ...form, password: item }) }}
                  placeholder='Entrez le mot de passe'
                  placeholderTextColor={colors.secondary}
                  value={form.password}
                />
                {alertMDP ? <Icon name="exclamation-triangle" size={30} color={colors.alert} style={{ position: 'absolute', right: 15, }} /> : null}
              </View>
              <View className="justify-end items-end" style={{ width: WIDTH_BTN }} >
                <Link href="./recovery">
                  <Text style={{ color: colors.black }}>Mot de passe oublié?</Text>
                </Link>
              </View>
              {alertMDP ? <Text className="pt-1" style={{ color: colors.alert }}>Mot de passe : Ce champs doit être rempli</Text> : null}

            </View>
            <TouchableOpacity className="py-4 rounded-xl px-3" style={[{ width: WIDTH_BTN, color: colors.text, backgroundColor: colors.primary }]} onPress={submit}>
              <Text className="text-center font-medium text-2xl" style={[{ color: colors.text2 }]}>Se connectez</Text>
            </TouchableOpacity>
            <View className="border-b border-gray-300 my-2.5 w-3/4" />
            <TouchableOpacity className="py-4 rounded-xl px-3 justify-center mb-10" style={[{ color: colors.text, backgroundColor: colors.primary }]} onPress={() => router.push("./signup")}>
              <Text className="text-center font-medium text-2xl" style={[{ color: colors.text2 }]}>Créez un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default signin

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  text: {
    flexDirection: 'row', // Aligne les lettres horizontalement
  },
  letter: {
    color: '#ffdb4e', // Couleur du texte (jaune)
    fontSize: 32, // Taille de la police
    fontWeight: 'bold', // Poids de la police
    textShadowColor: 'blue', // Couleur du contour
    textShadowOffset: { width: 3, height: 3 }, // Décale l'ombre pour simuler un contour
    textShadowRadius: 3, // Fait en sorte que l'ombre soit un peu floue pour un effet plus doux
  },
  
});