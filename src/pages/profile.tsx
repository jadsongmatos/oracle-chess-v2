import Head from "next/head";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";

import Header from "@/components/header";
import Select from "@/components/select";

type Select_t = {
  value: number;
  label: String;
};

function buscaBinaria(array: Array<any>, alvo: number) {
  let inicio = 0;
  let fim = array.length - 1;

  while (inicio <= fim) {
    let meio = Math.floor((inicio + fim) / 2);

    if (array[meio].value === alvo) {
      // item encontrado, retorna o índice
      return meio;
    }
    if (array[meio].value < alvo) {
      // o alvo está à direita do meio, então move o início para meio + 1
      inicio = meio + 1;
    } else {
      // o alvo está à esquerda do meio, então move o fim para meio - 1
      fim = meio - 1;
    }
  }

  // alvo não encontrado na lista
  return -1;
}

const fetchDataUf = async (input: any) => {
  const index_counry = buscaBinaria(input.countries, input.counry);
  console.log(
    "fetchDataUf",
    index_counry,
    input.counry,
    input.countries[index_counry].ISO
  );

  if (index_counry != -1) {
    const res = await fetch(
      `https://www.geonames.org/servlet/geonames?&srv=163&country=${input.countries[index_counry].ISO}&featureCode=ADM1&lang=en&type=json`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    try {
    } catch (error) {}
    const uf_city = await res.json();
    //console.log("uf_city", uf_city);
    return uf_city.geonames.map((e: any) => {
      return { value: Number(e.adminCode1), label: e.name };
    });
  } else {
    throw new Error("counry invalido");
  }
};

const fetchDataCity = async (input: any) => {
  console.log("fetchDataCity",input)
  /*const index_counry = buscaBinaria(input.countries, input.counry);
  console.log(
    "fetchData",
    index_counry,
    input.counry,
    input.countries[index_counry].ISO
  );

  if (index_counry != -1) {
    const res = await fetch(
      `https://www.geonames.org/servlet/geonames?&srv=163&country=${input.countries[index_counry].ISO}&featureCode=ADM1&lang=en&type=json`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    try {
    } catch (error) {}
    const uf_city = await res.json();
    //console.log("uf_city", uf_city);
    return uf_city.geonames.map((e: any) => {
      return { value: Number(e.adminCode1), label: e.name };
    });
  } else {
    throw new Error("counry invalido");
  }*/
};

export default function ProfileEdit(props: any) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [select_counry, set_select_counry] = useState(null);
  const [select_uf, set_select_uf] = useState(null);
  const [select_city, set_select_city] = useState(null);
  const [options_uf, set_options_uf] = useState([]);
  const [options_city, set_options_city] = useState([]);
  

  const uf_mutation = useMutation(fetchDataUf, {
    onSuccess: (data: any) => {
      // Atualiza o estado do componente com os novos dados
      set_options_uf(data);
    },
  });

  const city_mutation = useMutation(fetchDataCity, {
    onSuccess: (data: any) => {
      // Atualiza o estado do componente com os novos dados
      set_options_city(data);
    },
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <>
      <Head>
        <title>Perfil - Oracle Chess</title>
      </Head>
      <Header />
      <main className="mt-5 py-5">
        <section className="container mb-5">
          <h1>Edit Profile</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row g-3 needs-validation"
          >
            <div className="col-12">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                {...register("username", {
                  required: true,
                  minLength: 6,
                })}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  Por favor ensira um nome válido!
                </div>
              )}
            </div>
            <div className="col-sm-6">
              <Controller
                name="countries"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    options={props.countries}
                    onChange={(e: any) => {
                      set_select_counry(e);
                      uf_mutation.mutate({
                        countries: props.countries,
                        counry: e.value,
                      });
                      field.onChange(e); // make sure to keep this to update form state
                    }}
                    value={select_counry}
                    placeholder="Pais"
                    styles={{
                      control: (baseStyles: any, state: any) => ({
                        ...baseStyles,
                        borderColor: state.isFocused ? "grey" : "blue",
                        borderRadius: "20px",
                        border: "2px solid #ffffff",
                        margin: "8px",
                      }),
                    }}
                  />
                )}
              />
            </div>
            <div className="col-sm-6">
              <Controller
                name="uf"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    options={uf_mutation.data}
                    onChange={(e: any) => {
                      set_select_city(e);
                      city_mutation.mutate({
                        cities: city_mutation.data,
                        city: e.value,
                      });
                      field.onChange(e);
                    }}
                    value={select_uf}
                    placeholder="Estado"
                    styles={{
                      control: (baseStyles: any, state: any) => ({
                        ...baseStyles,
                        borderColor: state.isFocused ? "grey" : "blue",
                        borderRadius: "20px",
                        border: "2px solid #ffffff",
                        margin: "8px",
                      }),
                    }}
                  />
                )}
              />
            </div>
            <div className="d-flex mb-3 justify-content-center">
              {uf_mutation.status == "loading" ? (
                <div>Loading...</div>
              ) : (
                <>
                  {uf_mutation.status == "error" ? (
                    <div>
                      An error has occurred: {JSON.stringify(uf_mutation)}
                    </div>
                  ) : (
                    /*uf_mutation.data.map((e: any) => {
                      //return <>{JSON.stringify(e)}</>;
                    })*/
                    <></>
                  )}
                </>
              )}

              {/*<Controller
                  name="uf"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={uf}
                      onChange={(e: any) => {
                        set_select_uf(e);
                        set_options_city(uf_city[e.value]);
                        field.onChange(e); // make sure to keep this to update form state
                      }}
                      value={select_uf}
                      placeholder="Estado"
                      styles={{
                        control: (baseStyles: any, state: any) => ({
                          ...baseStyles,
                          borderColor: state.isFocused ? "grey" : "blue",
                          borderRadius: "20px",
                          border: "2px solid #ffffff",
                          margin: "8px",
                        }),
                      }}
                    />
                  )}
                />
         

              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    options={options_city}
                    placeholder="Cidade"
                    onChange={(e: any) => {
                      set_select_city(e);
                      field.onChange(e); // make sure to keep this to update form state
                    }}
                    value={select_city}
                    styles={{
                      control: (baseStyles: any, state: any) => ({
                        ...baseStyles,
                        borderColor: state.isFocused ? "#ffffff" : "#ffffff",
                        margin: "8px",
                        borderRadius: "20px",
                        border: "2px solid #ffffff",
                        width: "200px",
                      }),
                    }}
                  />
                )}
                  />*/}
            </div>

            <button className="btn btn-primary col-md-4" type="submit">
              Update Profile
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps(context: any) {
  const countries_json = require("../../public/countries.json");
  let countries: Array<Select_t> = countries_json.map((e: any) => {
    return { value: Number(e["ISO-Numeric"]), label: e.Country, ISO: e.ISO };
  });

  countries.sort((a, b) => a.value - b.value);

  return {
    props: {
      countries,
    },
  };
}
