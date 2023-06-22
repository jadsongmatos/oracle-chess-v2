import Head from "next/head";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import Header from "@/components/header";
import Select from "@/components/select";

export default function ProfileEdit(props: any) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [select_counry, set_select_counry] = useState(null);
  const [select_uf, set_select_uf] = useState(null);
  const [select_city, set_select_city] = useState(null);
  const [uf_options, set_uf_options] = useState();
  const [city_options, set_city_options] = useState();

  const counry_mutation = useMutation({
    mutationKey: ["uf"],
    mutationFn: async (input: any) => {
      //const index_counry = buscaBinaria(input.countries, input.counry.value);
      const previousData: any = queryClient.getQueryData([
        "uf",
        input.counry.value,
      ]);

      console.log("fetchDataUf", input, previousData);
      if (previousData) {
        set_uf_options(previousData);
        return previousData;
      }

      const res = await fetch(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${input.counry.ISO}&featureCode=ADM1&lang=en&type=json`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const uf = await res.json();
      const data = uf.geonames.map((e: any) => {
        return { value: Number(e.adminCode1), label: e.name };
      });
      set_uf_options(data);
      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["uf", variables.counry.value],
      });
      const previousData: any = queryClient.getQueryData([
        "uf",
        variables.counry.value,
      ]);

      //console.log("previousData", previousData, variables.counry.value);
      return previousData?.data;
    },
    onSuccess: async (data: any, variables: any) => {
      //console.log("useMutation", data, variables, select_counry);

      queryClient.setQueryData(["uf", variables.counry.value], data);
    },
    /*onError: (_, variables, context) => {
      queryClient.setQueryData(
        ["uf_data", variables.counry.value],
        context.previousData
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(["uf_data", variables.counry.value]);
    },*/
  });

  const uf_mutation = useMutation({
    mutationKey: ["city"],
    mutationFn: async (input: any) => {
      const previousData: any = queryClient.getQueryData([
        "city",
        input.counry.value,
      ]);

      if (previousData) {
        set_city_options(previousData);
        return previousData;
      }

      const res = await fetch(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${input.counry.ISO}&adminCode1=${input.uf}&featureCode=ADM2&lang=en&type=json`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      try {
        const city = await res.json();
        const data = city.geonames.map((e: any) => {
          return { value: Number(e.adminCode1), label: e.name };
        });
        set_city_options(data);
        return data;
      } catch (error) {
        throw new Error("json");
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["city", variables.counry.value],
      });
      const previousData: any = queryClient.getQueryData([
        "city",
        variables.counry.value,
      ]);
      return previousData;
    },
    onSuccess: async (data: any, variables: any) => {
      queryClient.setQueryData(["city", variables.counry.value], data);
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
                      set_select_uf(null);
                      set_select_city(null);
                      set_city_options(undefined)
                      counry_mutation.mutate({
                        counry: e,
                      });

                      field.onChange(e); // make sure to keep this to update form state
                    }}
                    value={select_counry}
                    instanceId="countries-select"
                    placeholder="Paises"
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
              {counry_mutation.status == "loading" ? (
                <div>Loading...</div>
              ) : (
                <>
                  {counry_mutation.status == "error" ? (
                    <div>
                      An error has occurred: {JSON.stringify(counry_mutation)}
                    </div>
                  ) : (
                    <Controller
                      name="uf"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={uf_options}
                          onChange={(e: any) => {
                            set_select_uf(e);
                            set_select_city(null);
                            uf_mutation.mutate({
                              counry: select_counry,
                              uf: e.value,
                            });
                            field.onChange(e);
                          }}
                          value={select_uf}
                          instanceId="uf-select"
                          placeholder="Estados"
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
                  )}
                </>
              )}
            </div>
            <div className="col-sm-6">
              {uf_mutation.status == "loading" ? (
                <div>Loading...</div>
              ) : (
                <>
                  {uf_mutation.status == "error" ? (
                    <div>
                      An error has occurred: {JSON.stringify(uf_mutation)}
                    </div>
                  ) : (
                    <Controller
                      name="city"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={city_options}
                          onChange={(e: any) => {
                            set_select_city(e);
                            field.onChange(e);
                          }}
                          value={select_city}
                          instanceId="city-select"
                          placeholder="Cidades"
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
                  )}
                </>
              )}
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
  let countries: Array<any> = countries_json.map((e: any) => {
    return { value: Number(e["ISO-Numeric"]), label: e.Country, ISO: e.ISO };
  });

  countries.sort((a, b) => a.value - b.value);

  return {
    props: {
      countries,
    },
  };
}
