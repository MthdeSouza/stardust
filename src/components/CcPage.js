import React, { useContext, useEffect, useReducer, useState } from "react";
import CentroCustoContext from "./contexts/centroCustoContext";
import centroCustoReducer from "./reducers/centroCustoReducer";
import CcList from "./CcList";
import CcForm from "./CcForm";
import axios from "axios";

export default function ccPage() {
  const useAPI = (endpoint) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      getData();
    }, []);

    const getData = async () => {
      const response = await axios.get(endpoint);
      setData(response.data);
    };
    console.log(
      "https://hooks-api-matheusalex-hotmailcom.vercel.app/centroCusto response.data:",
      data
    );
    return data;
  };

  const AppCcPage = () => {
    const centroCustoInitialState = useContext(CentroCustoContext);
    const [state, dispatch] = useReducer(
      centroCustoReducer,
      centroCustoInitialState
    );

    const savedCc = useAPI(
      "https://hooks-api-matheusalex-hotmailcom.vercel.app/centroCusto"
    );
    console.log("savedCc:", savedCc);

    useEffect(() => {
      dispatch({
        type: "GET_CCS",
        payload: savedCc,
      });
    }, [savedCc]);

    return (
      <CentroCustoContext.Provider value={{ state, dispatch }}>
        <CcForm />
        <CcList />
      </CentroCustoContext.Provider>
    );
  };

  return <AppCcPage />;
}
