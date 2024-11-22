import axios from "axios";


//  * Fetch the list of available currencies from the API
 
const fetchCurrenciesList = async (setCurrencies:any,setError:any) => {
await axios.get('https://v6.exchangerate-api.com/v6/afd57be15f0757b2b91392c0/latest/USD')
.then((response) => {
  setCurrencies(Object.keys(response.data.conversion_rates));

})
    .catch (error=>{
      setError(error.message)});
    
  };


  //  * Fetch the conversion rate from the API
  
  const fetchResult = async ( amount: string, ConverterdFrom: string, Converterdto: string, setConversionRate: any, setConvertedAmount: any,setError:any) => {

      const response = await axios.get(`https://v6.exchangerate-api.com/v6/afd57be15f0757b2b91392c0/latest/${ConverterdFrom}`)
      .then((response) => {
        const conversion_rates = response.data.conversion_rates
        
        const conversion_rate = conversion_rates[Converterdto];
  
        setConversionRate(conversion_rate);
        if(conversion_rates){
          const result = parseFloat(amount)* conversion_rate
          if(isNaN(result)){
            setConvertedAmount('0');
          }else{
          setConvertedAmount(result.toFixed(3));
      }}})
      .catch (error=>{
        setError(error.message)});

    };


export {fetchCurrenciesList,fetchResult}

