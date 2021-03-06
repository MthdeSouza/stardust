/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-template-curly-in-string */
import React, { useState, useContext, useEffect } from "react";
import { uuid } from "uuidv4";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Divider,
  InputNumber,
  Col,
  Row,
  TimePicker,
  Typography,
} from "antd";
import moment from "moment";
import EventosContext from "../contexts/eventoContext";
import currencyList from "../globals/currency";
import locale from "../globals/locale";
import EventosParcelas from "./EventosParcelas";
import baseUrl from "../globals/baseUrl";

const { Text } = Typography;

export default function EventosForm() {
  const formRef = React.createRef();
  const dateFormat = "DD/MM/YYYY";

  const [form] = Form.useForm();

  const [evento, setEvento] = useState("");
  const {
    state: { currentEvento = {}, eventoTodos = [] },
    dispatch,
  } = useContext(EventosContext);

  useEffect(() => {
    if (
      Object.keys(currentEvento).length !== 0 ||
      currentEvento.constructor !== Object
    ) {
      setEvento(currentEvento);
      form.setFieldsValue({
        titulo: currentEvento.titulo,
        text: currentEvento.text,
        price: currentEvento.price,
        dataEvento: moment(currentEvento.dataEvento),
        horarioEvento: currentEvento.dataEvento
          ? moment(currentEvento.dataEvento)
          : "",
      });
    } else {
      onReset();
    }
  }, [currentEvento]);

  const onReset = () => {
    dispatch({ type: "SET_EVENTO_TODOS", payload: [] });
    formRef.current.resetFields();
    setEvento({ ...evento, dataEvento: moment() });
  };

  const handleDateChange = (date, dateString) => {
    if (!!date) {
      setEvento({ dataEvento: dateString });
    }
  };

  const validateMessages = {
    required: "${label} é obrigatório",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const App = () => {
    const onFinish = async (values) => {
      const newDate = new Date(values.dataEvento);
      const dataEvento = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        0,
        0,
        0
      );

      if (
        Object.keys(currentEvento).length !== 0 ||
        currentEvento.constructor !== Object
      ) {
        const reponse = await axios.put(`${baseUrl}/eventos/`, {
          _id: currentEvento._id,
          evento: {
            titulo: values.titulo,
            dataEvento: dataEvento,
            text: values.text,
            price: values.price,
            horarioEvento: values.horarioEvento || "",
          },
        });
        dispatch({ type: "UPDATE_EVENTO", payload: reponse.data });
      } else {
        const response = await axios.post(`${baseUrl}/eventos/`, {
          id: uuid(),
          titulo: values.titulo,
          text: values.text,
          dataEvento: dataEvento,
          price: values.price,
          horarioEvento: values.horarioEvento || "",
        });
        dispatch({ type: "ADD_EVENTO", payload: response.data });
      }
    };

    const currencyFormatter = (selectedCurrOpt) => (value) => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: selectedCurrOpt.split("::")[1],
      }).format(value);
    };

    const currencyParser = (val) => {
      try {
        if (typeof val === "string" && !val.length) {
          val = "0.0";
        }

        var group = new Intl.NumberFormat(locale)
          .format(1111)
          .replace(/1/g, "");
        var decimal = new Intl.NumberFormat(locale)
          .format(1.1)
          .replace(/1/g, "");
        var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
        reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
        reversedVal = reversedVal.replace(/[^0-9.]/g, "");
        const digitsAfterDecimalCount = (reversedVal.split(".")[1] || [])
          .length;
        const needsDigitsAppended = digitsAfterDecimalCount > 2;

        if (needsDigitsAppended) {
          reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
        }

        return Number.isNaN(reversedVal) ? 0 : reversedVal;
      } catch (error) {
        console.error(error);
      }
    };

    const temDivergencia = (valor) => {
      let TotalParcelas = 0;

      if (
        Object.keys(eventoTodos).length !== 0 &&
        eventoTodos.constructor !== Object
      ) {
        eventoTodos.forEach((element) => {
          TotalParcelas = TotalParcelas + element.price;
        });
        return valor !== TotalParcelas;
      }
      return false;
    };

    return (
      <Col span={22} offset={1}>
        <Form
          onFinish={onFinish}
          ref={formRef}
          layout="vertical"
          form={form}
          initialValues="vertical"
          className="flex-1 m-2 "
          validateMessages={validateMessages}
        >
          <Divider orientation="left">Registro de evento</Divider>

          <Form.Item
            label="Nome do evento"
            name="titulo"
            rules={[{ required: true }]}
            form={form}
          >
            <Input placeholder="Nome do evento" />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name="text"
            rules={[{ required: true }]}
            form={form}
          >
            <Input.TextArea
              rows="2"
              placeholder="Descreva um pouco o evento"
              className="flex-1 border-grey border-solid border-2 mr-2 p-1 w-full"
            />
          </Form.Item>
          <Row>
            <Col span={6} offset={0}>
              <Form.Item
                label="Valor do ensaio"
                name="price"
                rules={[{ required: true }]}
                form={form}
              >
                <InputNumber
                  style={{ width: "auto" }}
                  placeholder="R$ 0.00"
                  prefix="R$ "
                  formatter={currencyFormatter(
                    `${currencyList.CtryNm}::${currencyList.Ccy}`
                  )}
                  parser={currencyParser}
                />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item
                label="Data do evento"
                name="dataEvento"
                rules={[{ required: true }]}
                form={form}
              >
                <DatePicker
                  format={dateFormat}
                  placeholder="01/01/2001"
                  onChange={handleDateChange}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item
                label="Horario do evento"
                name="horarioEvento"
                form={form}
              >
                <TimePicker placeholder="00:00:00" format="HH:mm:ss" />
              </Form.Item>
            </Col>
          </Row>
          {temDivergencia(currentEvento.price) ? (
            <Row>
              <Text type="danger">
                * Este evento possui divergecia entre valor geral e total das
                parcelas
              </Text>
            </Row>
          ) : null}
          <Row>
            <Col span={8} offset={0}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mr-4"
                  // onClick={handleSubmit}
                >
                  Salvar
                </Button>
                <Button danger htmlType="button" onClick={onReset}>
                  Limpar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left">Registro de parcelas</Divider>
        <EventosParcelas />
      </Col>
    );
  };

  return <App />;
}
