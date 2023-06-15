import Head from "next/head";
//import Image from 'next/image'
import dynamic from "next/dynamic";

import { useEffect, useState, useRef } from "react";

const Chessground: any = dynamic(() => import("react-chessground" as any), {
  ssr: false,
});

import Header from "@/components/header";

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
  const [msg_worker, set_msg_worker] = useState<any>();
  const [moves, set_moves] = useState(0);
  const [start_time, set_start_time] = useState(performance.now());

  const workers_ref: any = useRef([]);

  useEffect(() => {
    const hardwareConcurrency = window.navigator.hardwareConcurrency;
    set_cpu_threads(hardwareConcurrency);

    for (let i = 0; i < hardwareConcurrency; i++) {
      workers_ref.current[i] = new Worker(
        new URL("@/workers/job.ts", import.meta.url)
      );

      workers_ref.current[i].onmessage = (event: any) => {
        set_msg_worker({ data: event.data, id: i });
        //console.log("progress", i, event.data.moves);
      };

      //workers_ref.current[i].terminate();
    }
  }, []);

  useEffect(() => {
    if (msg_worker?.data?.type == "progress") {
      chess_grounds[msg_worker?.id] = msg_worker.data;
      set_moves(moves + msg_worker.data.new_moves);
    } else if (msg_worker?.data?.type == "then") {
      console.log("msg_worker", msg_worker, jobs);
      set_jobs(jobs.filter((job) => job.id !== msg_worker.data.id));
    }
    set_msg_worker(null);
  }, [msg_worker, chess_grounds, jobs, moves]);

  useEffect(() => {
    console.log("starting", start);
    if (start == true) {
      for (let i = 0; i < jobs.length; i++) {
        workers_ref.current[i % n_threads].postMessage({ job: jobs[i] });
      }
    }
  }, [jobs, start, n_threads]);

  const add_job = async (number: number, start: boolean) => {
    let new_jobs = jobs;
    let new_id = job_id + 1;
    try {
      let new_job: Array<Move> = [];
      for (let i = 0; i < number; i++) {
        const response = await fetch("/api/tree", {
          method: "GET",
          redirect: "follow",
        });
        new_job = await response.json();
        new_job.sort((a, b) => a.id - b.id);
        console.log("new_job", new_job);

        new_id++;
        new_jobs.push({ moves: new_job, id: new_id });
      }
    } catch (err) {
      console.log(err);
    }

    set_job_id(new_id);
    set_jobs(new_jobs);
    set_start(start);
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
        <title>Oracle Chess</title>
      </Head>
      <Header />

      <main className="mt-5 py-5">
        <section className="container mb-5 text-center">
          <h1>Oracle Chess</h1>
        </section>
        <section className="container my-5">
          <p>
            CPU: {cpu_threads} Total: {moves}{" "}
          </p>
          <p>
            {Math.ceil(moves / ((performance.now() - start_time) / 1000))}{" "}
            Movimentos/s
          </p>
          <ol>
            {jobs
              ? jobs.map((job: any, i: number) => {
                  return <li key={i}>{JSON.stringify(job)}</li>;
                })
              : null}
          </ol>
        </section>
        <section className="container">
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
                  <p>{(e ? e.moves_PerSec : 0) + " Movimentos/s"}</p>
                </li>
              );
            })}
          </ol>
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
                  const n_idle_threads = n_threads - jobs.length;
                  add_job(n_idle_threads, !start);
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
