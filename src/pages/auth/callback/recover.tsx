import { getCsrfToken } from "next-auth/react";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Recover({ csrfToken }: any) {
  const router = useRouter();
  useEffect(() => {
    const { token, email } = router.query;
    axios
      .post(`/api/auth/callback/credential?token=${token}&email=${email}`, {
        csrfToken: csrfToken,
      })
      .then((result) => {
        console.log("result", result);
        router.push("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
