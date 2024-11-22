/**
 * Main component for the currency converter app.
 * Handles user input and displays the result of the conversion.
 * Also handles loading and saving of the data.
 */
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Image,
} from "react-native";
import { fetchCurrenciesList, fetchResult } from "./api/index";
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Toast from "react-native-root-toast";

export default function CurrencyConverter() {
  // State variables
  const [amount, setAmount] = useState("0");
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [ConverterdFrom, setConverterdFrom] = useState("USD");
  const [Converterdto, setConverterdto] = useState("INR");
  const [conversion_rate, setConversionRate] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [openfrom, setOpenfrom] = useState(false);
  const [opento, setOpento] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [error, setError] = useState();

  // Toast for error messages
  const toast = (error: any) => {
    Toast.show(error, {
      textColor: "red",
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
    setError(undefined);
  };

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedFrom = await AsyncStorage.getItem("convertedFrom");
        const savedTo = await AsyncStorage.getItem("convertedTo");
        const savedAmount = await AsyncStorage.getItem("amount");

        if (savedFrom) setConverterdFrom(savedFrom);
        if (savedTo) setConverterdto(savedTo);
        if (savedAmount) setAmount(savedAmount);
      } catch (error) {
        toast(error);
      }
    };

    loadSavedData();
  }, []);

  // Save data when currencies or amount change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("convertedFrom", ConverterdFrom ?? "");
        await AsyncStorage.setItem("convertedTo", Converterdto ?? "");
        await AsyncStorage.setItem("amount", amount ?? "");
      } catch (error) {
        toast(error);
      }
    };

    saveData();
  }, [ConverterdFrom, Converterdto, amount]);

  useEffect(() => {
    fetchCurrenciesList(setCurrencies, setError);
  }, []);
  useEffect(() => {
    fetchResult(
      amount,
      ConverterdFrom,
      Converterdto,
      setConversionRate,
      setConvertedAmount,
      setError
    );
  }, [amount, ConverterdFrom, Converterdto]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
        setOpenfrom(false);
        setOpento(false);
      }}
      className="flex bg-gray-900 "
    > 
      <View className="flex  justify-center  w-full h-full ">
        <Text className="text-3xl font-bold w-full text-center text-white h-10 my-14  ">Currency Converter</Text>
      
      <View className="flex flex-col justify-items-start items-center my-8 ">
      <Image source={require('../assets/images/ector-currency-exchange-money-conversion-rupee-dollar-icon-isolated-usd-inr_615232-1362__1_-removebg-preview.png')}  style={{ width: 150, height: 150,backgroundColor:'gray' }} className="mx-auto my-0  bg-gray-900 rounded-lg" />
        </View>
        
        <View className="flex  w-full  mx-auto  ">
          <TextInput
            placeholder="Enter Amount"
            className="mx-auto bg-gray-500 w-5/6 rounded-lg px-4 py-3 text-white"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View className="flex flex-row w-full justify-evenly my-10 mb-8">
          {/* Dropdown for selecting the from currency */}
          <DropDownPicker
            style={{ width: 100, padding: 20, borderRadius: 9 }}
            containerStyle={{ width: 100, margin: 10 }}
            open={openfrom}
            setOpen={setOpenfrom}
            value={ConverterdFrom}
            items={currencies.map((currency) => ({
              label: currency,
              value: currency,
            }))}
            setValue={setConverterdFrom}
            searchPlaceholder="Search Currency"
            placeholder="From"
            onClose={() => setOpenfrom(false)}
          />

          {/* Button for swapping the currencies */}
          <TouchableOpacity
            className={`align-middle flex  justify-center border border-black rounded-full w-10 h-10 my-auto  ${
              pressed ? "bg-black" : "bg-white"
            }`}
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="swap-horizontal-variant"
              className="text-center active:text-white"
              size={24}
              color={pressed ? "white" : "black"}
              onPress={() => {
                setPressed(!pressed);
                const temp = ConverterdFrom;
                setConverterdFrom(Converterdto);
                setConverterdto(temp);
              }}
            />
          </TouchableOpacity>

          {/* Dropdown for selecting the to currency */}
          <DropDownPicker
            style={{ width: 100, padding: 20, borderRadius: 9 }}
            containerStyle={{ width: 100, margin: 10 }}
            open={opento}
            setOpen={setOpento}
            value={Converterdto}
            items={currencies.map((currency) => ({
              label: currency,
              value: currency,
            }))}
            setValue={setConverterdto}
            searchPlaceholder="Search Currency"
            placeholder="To"
            onClose={() => setOpento(false)}
          />
        </View>
        <View className="flex w-1/2 mx-auto my-16">
          {/* Show the conversion rate */}
          <Text className="text-gray-100  text-center mb-5 text-sm font-small">{`1 ${ConverterdFrom} = ${conversion_rate} ${Converterdto}`}</Text>
          {/* Show the converted amount */}
          <Text className=" text-white   text-center text-3xl font-bold    ">
            {convertedAmount} {Converterdto}
          </Text>
        </View>
        {/* Show error message if there is an error */}
        {error && toast(error)}
      </View>
    </TouchableOpacity>
  );
}

