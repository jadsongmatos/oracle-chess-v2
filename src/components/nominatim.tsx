import { useEffect, useState } from "react";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import countries from "../../public/countries.json";

const binarySearchByISO = (targetISO: string) => {
  let left = 0;
  let right = countries.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparisonResult = countries[mid].ISO.localeCompare(targetISO);

    if (comparisonResult === 0) {
      return mid; // Elemento encontrado, retorna o índice
    }

    if (comparisonResult < 0) {
      left = mid + 1; // O elemento está à direita
    } else {
      right = mid - 1; // O elemento está à esquerda
    }
  }

  return -1; // Elemento não encontrado
};

export default function Nominatim() {
  const queryClient = useQueryClient();
  const [lat_lon, set_lat_lon] = useState([0, 0]);
  const [select_counry, set_select_counry] = useState<any>(false);
  const [select_uf, set_select_uf] = useState<any>(false);

  const localisacao = useQuery(["localisacao"], () => {
    const previousData_coords: any = queryClient.getQueryCache().getAll();

    for (let i = 0; i < previousData_coords.length; i++) {
      if (previousData_coords[i].queryKey[0] == "coords") {
        if (previousData_coords[i].queryKey[1] != undefined) {
          if (
            previousData_coords[i].queryKey[1][0] != 0 &&
            previousData_coords[i].queryKey[1][1] != 0
          ) {
            return previousData_coords[i].state.data;
          }
        }
      }
    }

    return null;
  });

  const coords = useQuery(["coords", lat_lon], async () => {
    if (lat_lon[0] == 0 && lat_lon[1] == 0) {
      return null;
    }
    const previousData: any = queryClient.getQueryData(["coords", lat_lon]);
    console.log("coords useQuery", previousData, lat_lon);

    if (previousData) {
      return previousData;
    }

    let new_localisacao = {
      city: null,
      uf: {},
      counry: {},
      latitude: lat_lon[0],
      longitude: lat_lon[1],
    };
    let uf = "";
    let counry = "";
    let city = "";
    try {
      const nominatim_res = await axios(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat_lon[0]}&lon=${lat_lon[1]}`
      );

      //console.log("nominatim_res", nominatim_res.data);
      city = nominatim_res.data.address.town;
      uf = nominatim_res.data.address.state;
      counry = nominatim_res.data.address["country_code"].toLocaleUpperCase();
    } catch (err) {
      console.log("err", err);
    }

    new_localisacao.counry = countries[binarySearchByISO(counry)];
    set_select_counry(new_localisacao.counry);

    const previousData_uf: any = queryClient.getQueryData(["uf", counry]);

    if (previousData_uf) {
      //console.log("previousData_uf -----", previousData_uf);
      for (let i = 0; i < previousData_uf.length; i++) {
        if (previousData_uf[i].label == uf) {
          new_localisacao.uf = previousData_uf[i];
          set_select_uf(previousData_uf[i]);
          const previousData_city: any = queryClient.getQueryData([
            "city",
            previousData_uf[i].value,
          ]);
          if (previousData_city) {
            //console.log("previousData_city -----", previousData_city);

            for (let j = 0; j < previousData_city.length; j++) {
              if (previousData_city[j].label == city) {
                new_localisacao.city = previousData_city[j];
                console.log("new_localisacao", new_localisacao);
                queryClient.invalidateQueries(["localisacao"]);
                queryClient.setQueryData(["localisacao"],new_localisacao)
                return new_localisacao;
              }
            }
          }
          break;
        }
      }
    }
    return null;
  });

  const uf_options = useQuery(["uf", select_counry?.ISO], async () => {
    if (!select_counry) {
      return false;
    }

    const previousData: any = queryClient.getQueryData([
      "uf",
      select_counry.ISO,
    ]);

    console.log("nominatim uf useQuery", select_counry, previousData);
    if (previousData) {
      return previousData;
    }

    try {
      const res = await axios(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${select_counry.ISO}&featureCode=ADM1&lang=en&type=json`
      );
      const data = res.data.geonames.map((e: any) => {
        return { value: Number(e.adminCode1), label: e.name };
      });

      return data;
    } catch (err) {
      console.log("err", err);
      throw new Error("Network response was not ok");
    }
  });

  const city_options = useQuery(["city", select_uf.value], async () => {
    if (!select_uf) {
      return false;
    }

    console.log("city useQuery", select_uf);
    const previousData: any = queryClient.getQueryData([
      "city",
      select_uf.value,
    ]);

    if (previousData) {
      return previousData;
    }

    try {
      const res = await axios(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${
          select_counry.ISO
        }&adminCode1=${String(select_uf.value).padStart(
          2,
          "0"
        )}&featureCode=ADM2&lang=en&type=json`
      );

      const city = res.data.geonames.map((e: any) => {
        return { value: Number(e.adminCode2), label: e.name };
      });

      return city;
    } catch (err) {
      console.log("err", err);
      throw new Error("Network response was not ok");
    }
  });

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("coords", coords);
      navigator.geolocation.getCurrentPosition(async (position) => {
        set_lat_lon([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return <></>;
}
