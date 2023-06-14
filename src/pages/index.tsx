import Head from "next/head";
//import Image from 'next/image'
import dynamic from "next/dynamic";

import { useEffect, useState, useRef } from "react";

const Chessground: any = dynamic(() => import("react-chessground" as any), {
  ssr: false,
});

export type New_job = Move[];

export interface Move {
  move: number;
  id: number;
}

export default function Home() {
  const [cpu_threads, set_cpu_threads] = useState(1);
  const [n_threads, set_threads] = useState(1);
  const [start, set_start] = useState(false);
  const [jobs, set_jobs] = useState<Array<New_job>>([]);

  const workers_ref: any = useRef([]);

  useEffect(() => {
    const max_threads = window.navigator.hardwareConcurrency;
    set_cpu_threads(max_threads);

    for (let i = 0; i < max_threads; i++) {
      workers_ref.current[i] = new Worker("/workers/job.js");
    }
  }, []);

  useEffect(() => {
    const myWorker = new Worker("/workers/job.js");

    myWorker.postMessage("jadson"); // send data to the worker

    myWorker.onmessage = (event) => {
      // listen for messages from the worker
      console.log("recebendo message", event.data);
    };

    return () => {
      // clean up when the component unmounts
      myWorker.terminate();
    };
  }, []);

  const add_job = async () => {
    let new_job: New_job = [];
    try {
      const response = await fetch("http://localhost:3000/api/tree", {
        method: "GET",
        redirect: "follow",
      });
      new_job = await response.json();
      new_job.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.log("error ", error);
    }
    console.log("new_job", new_job);
    jobs.push(new_job);
    console.log("jobs", jobs);
  };

  const incrementar = async () => {
    if (n_threads < cpu_threads) {
      set_threads(n_threads + 1);
    }
  };

  const decrementar = async () => {
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
        </section>
      </main>
      <nav
        className="navbar fixed-bottom bg-body-tertiary rounded-top shadow-lg bg-primary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <input
            type="range"
            className="form-range col-12"
            min={1}
            max={cpu_threads}
            step={1}
            value={n_threads}
            readOnly={false}
            onChange={(event) => {
              const newValue = parseInt(event.target.value);
              console.log("range", newValue);
              set_threads(newValue);
            }}
          ></input>
          <div
            className="progress w-100 mb-3"
            role="progressbar"
            aria-label="Example with label"
            aria-valuenow={(n_threads / cpu_threads) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-bar"
              style={{
                width: (n_threads / cpu_threads) * 100 + "%",
              }}
            >
              {Math.ceil((n_threads / cpu_threads) * 100) + "%"}
            </div>
          </div>

          <div
            className="col-12 btn-group btn-group-lg"
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
            {start ? (
              <button
                type="button"
                className="btn btn-outline-primary active "
                onClick={() => set_start(!start)}
              >
                <span
                  className="spinner-border spinner-border-sm mx-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  add_job();
                  if (start == false) {
                    set_start(true);
                    workers_ref.current[0].postMessage("start");
                  } else {
                    set_start(false);
                  }
                }}
              >
                Iniciar
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={incrementar}
            >
              +
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
