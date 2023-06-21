import Head from "next/head";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { useQuery } from "react-query";

import Header from "@/components/header";
import Select from "@/components/select";

export default function ProfileEdit() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [select_uf, set_select_uf] = useState(null);
  const [options_city, set_options_city] = useState([]);
  const [select_city, set_select_city] = useState(null);



  const uf = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch("https://www.geonames.org/servlet/geonames?&srv=163&country=BR&featureCode=ADM1&lang=en&type=json").then(
        (res) => res.json(),
      ),
  })

  console.log("data", uf.data);


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
            <div className="d-flex mb-3 justify-content-center">
              {uf.isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  {uf.error ? (
                    <div>An error has occurred: {JSON.stringify(uf.error)}</div>
                  ) : (
                    uf.data.geonames.map((e:any) => {
                      return <>{JSON.stringify(e)}</>
                    })
                    
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
