import Head from "next/head";
//import Image from 'next/image'
import dynamic from "next/dynamic";

import { useEffect, useState, useRef } from "react";

const Chessground: any = dynamic(() => import("react-chessground" as any), {
  ssr: false,
});

export interface New_job {
  moves: Array<Move>;
  id: number;
}

export interface Move {
  move: number;
  id: number;
}

export default function Home() {
  const [cpu_threads, set_cpu_threads] = useState(1);
  const [n_threads, set_threads] = useState(1);
  const [start, set_start] = useState(false);
  const [jobs, set_jobs] = useState<Array<New_job>>([]);
  const [job_id, set_job_id] = useState(0);
  const [chess_grounds, set_chess_grounds] = useState<Array<any>>([null]);
  const [chess_grounds_progress, set_chess_grounds_progress] = useState<any>();

  const workers_ref: any = useRef([]);

  useEffect(() => {
    const hardwareConcurrency = window.navigator.hardwareConcurrency;
    set_cpu_threads(hardwareConcurrency);

    for (let i = 0; i < hardwareConcurrency; i++) {
      workers_ref.current[i] = new Worker(
        new URL("../workers/job.ts", import.meta.url)
      );

      workers_ref.current[i].onmessage = (event: any) => {
        //console.log("worker:", i, event);
        if (event.data.type == "progress") {
          set_chess_grounds_progress({ data: event.data, id: i });
          console.log("progress", i, event.data.moves);
        } else {
          set_jobs(jobs.filter((job) => job.id !== event.data.id));
        }
      };

      //workers_ref.current[i].terminate();
    }
  }, []);

  useEffect(() => {
    chess_grounds[chess_grounds_progress?.id] = chess_grounds_progress?.data;
  }, [chess_grounds_progress, chess_grounds]);

  useEffect(() => {
    if (start == true) {
      for (let i = 0; i < jobs.length; i++) {
        workers_ref.current[i % n_threads].postMessage({ job: jobs[i] });
      }
    }
  }, [jobs, start, n_threads]);

  const add_job = async () => {
    let new_job: Array<Move> = [];
    try {
      const response = await fetch("/api/tree", {
        method: "GET",
        redirect: "follow",
      });
      new_job = await response.json();
      new_job.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.log("error ", error);
    }
    console.log("new_job", new_job);

    let new_id = job_id + 1;
    set_job_id(new_id);
    jobs.push({ moves: new_job, id: new_id });
    console.log("jobs", jobs);
  };

  const incrementar = async () => {
    if (n_threads < cpu_threads) {
      set_threads(n_threads + 1);
      //add_job();
      chess_grounds.push(null);
    }
  };

  const decrementar = async () => {
    if (n_threads > 1) {
      set_threads(n_threads - 1);
      chess_grounds.pop();
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
          <ol>
            {jobs
              ? jobs.map((job: any, i: number) => {
                  return <li key={i}>{JSON.stringify(job)}</li>;
                })
              : null}
          </ol>
        </section>
        <section className="container">
          <div className="row">
            <ol className="list-group-numbered row">
              {chess_grounds.map((e, i) => {
                return (
                  <li key={i} className="mb-5 text-center col-md-4">
                    <div className="mx-auto">
                      <Chessground
                        fen={
                          e
                            ? e.fen
                            : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
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
                    <br />
                    <p>
                      {chess_grounds[0]
                        ? Math.ceil(
                            ((chess_grounds[0].moves * 100) / 30) ^ 3.5
                          ) + "%"
                        : "0%"}
                    </p>
                  </li>
                );
              })}
            </ol>
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
                  set_start(!start);
                  const n_idle_threads = n_threads - jobs.length;
                  try {
                    for (let i = 0; i < n_idle_threads; i++) {
                      add_job();
                    }
                  } catch (err) {
                    console.log(err);
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
