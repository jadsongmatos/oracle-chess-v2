import Head from "next/head";
//import Image from 'next/image'
import dynamic from "next/dynamic";

import { useCallback, useEffect, useRef, useState } from "react";

const Chessground = dynamic(() => import("react-chessground"), { ssr: false });

export default function Home() {
  const [cpu_threads, set_cpu_threads] = useState(1);
  const [n_threads, set_threads] = useState(1);
  useEffect(() => {
    set_cpu_threads(window.navigator.hardwareConcurrency);
  }, []);

  const incrementar = () => {
    if (n_threads < cpu_threads) {
      set_threads(n_threads + 1);
    }
  };

  const decrementar = () => {
    if (n_threads > 1) {
      set_threads(n_threads - 1);
    }
  };

  return (
    <>
      <Head>
        <meta name="description" content="Jogo de xadrez" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta name="description" content="Jogo de xadrez" />
        <meta
          property="og:url"
          content="https://github.com/jadsongmatos/oracle-chess"
        />
        <meta property="og:site_name" content="Oracle Chess" />
        <meta property="og:title" content="Oracle Chess" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:description" content="Oracle Chess" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site_name" content="Oracle Chess" />
        <meta name="twitter:title" content="Oracle Chess" />
        <meta name="twitter:card" content="Jogo de xadrez" />
        <meta name="twitter:description" content="Oracle Chess" />
        <meta name="twitter:image" content="/favicon.ico" />
        <meta name="image" content="/favicon.ico" />
        <title>Oracle Chess</title>
      </Head>
      <main className="mt-5 py-5">
        <section className="container mb-5 text-center">
          <h1>Oracle Chess</h1>
        </section>
        <section className="container my-5">
          <p>CPU: {cpu_threads} </p>
          <p></p>
        </section>
        <section className="container">
          <div className="row">
            {n_threads > 1 ? (
              <>
                <div className="col-md-6">
                  <ol className="list-group-numbered">
                    {Array.from(
                      { length: Math.ceil(n_threads / 2) },
                      (v, i) => {
                        return (
                          <li key={i} className="mb-5">
                            <div className="mx-auto">
                              <Chessground
                                fen={
                                  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                                }
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  marginRight: "auto",
                                  marginLeft: "auto",
                                }}
                                viewOnly={true}
                                draggable={{ enabled: false }}
                                addDimensionsCssVars={false}
                              />
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ol>
                </div>
                <div className="col-md-6">
                  <ol className="list-group-numbered">
                    {Array.from({ length: n_threads / 2 }, (v, i) => {
                      return (
                        <li key={i} className="mb-5">
                          <div className="mx-auto">
                            <Chessground
                              fen={
                                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                              }
                              style={{
                                width: "200px",
                                height: "200px",
                                marginRight: "auto",
                                marginLeft: "auto",
                              }}
                              viewOnly={true}
                              draggable={{ enabled: false }}
                              addDimensionsCssVars={false}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </>
            ) : (
              <div className="col-md-6">
                <ol className="list-group-numbered">
                  <li key={1} className="mb-5">
                    <div className="mx-auto">
                      <Chessground
                        fen={
                          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        }
                        style={{
                          width: "200px",
                          height: "200px",
                          marginRight: "auto",
                          marginLeft: "auto",
                        }}
                        viewOnly={true}
                        draggable={{ enabled: false }}
                        addDimensionsCssVars={false}
                      />
                    </div>
                  </li>
                </ol>
              </div>
            )}
          </div>

          <div
            className="col-12 mt-5  btn-group btn-group-lg"
            role="group"
            aria-label="Large button group"
          >
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={decrementar}
            >
              -
            </button>
            <button type="button" className="btn btn-outline-primary">
              Threads: {n_threads}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={incrementar}
            >
              +
            </button>
          </div>
          <label htmlFor="rangeThread" className="form-label mt-3 ">
            Example range
          </label>
          <input
            type="range"
            className="form-range col-12"
            min={1}
            max={cpu_threads}
            step={1}
            value={n_threads}
            readOnly={false}
            id="rangeThread"
            onChange={(event) => {
              const newValue = parseInt(event.target.value);
              console.log("range", newValue);
              set_threads(newValue);
            }}
          ></input>
        </section>
      </main>
    </>
  );
}
