/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useReducer, useState } from "react";
import CentroCustoContext from "../contexts/centroCustoContext";
import centroCustoReducer from "../reducers/centroCustoReducer";
import CcList from "./CcList";
import CcForm from "./CcForm";
import axios from "axios";
import BASE_URL from "../globals/baseUrl";

export default function ccPage() {
  const useAPI = (endpoint) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      getData();
    }, [endpoint]);

    const getData = async () => {
      const response = await axios.get(endpoint);
      setData(response.data);
    };
    return data;
  };

  const AppCcPage = () => {
    const centroCustoInitialState = useContext(CentroCustoContext);
    const [state, dispatch] = useReducer(
      centroCustoReducer,
      centroCustoInitialState
    );
    const savedCc = useAPI(`${BASE_URL}/centroCustos`);

    useEffect(() => {
      dispatch({
        type: "GET_CC",
        payload: savedCc,
      });
    }, [savedCc]);

    return (
      <CentroCustoContext.Provider
        value={{ state, dispatch }}
        className="flex justify-center"
      >
        <CcList />
        <CcForm />
      </CentroCustoContext.Provider>
    );
  };

  return <AppCcPage />;
}
