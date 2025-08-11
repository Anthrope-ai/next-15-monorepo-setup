/**
 * ErrorPage component or module.
 */

"use client"

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { HomeIcon } from "@heroicons/react/24/outline";
// @ts-ignore
import ErrorPageImage from "../../assets/illustrations/error-page.svg";
// @ts-ignore
import NoInternetFound from "../../assets/illustrations/no-internet.png";

interface ErrorPageProps {
  title?: string;
  description?: string;
  code?: any;
}

export default function ErrorPage({ code , title, description }: ErrorPageProps) {
  const router = useRouter();

  const [error, setError] = React.useState<any>({
    title: "",
    description: ""
  });

  const handleHome = () => {
    router.push("/");
  };

  useEffect(() => {
    if(code === "ERR_NETWORK") {
      setError({
        title: "No internet connection",
        description: "Please check your internet connection and try again."
      })
    } else {
      setError({
        title: title || "Oops! Something went wrong",
        description: description || "We couldn't find the page you were looking for. Please go back to the homepage."
      })
    }
  }, [code]);

  return (
    <div className={"w-full flex flex-col h-[400px] justify-center items-center gap-y-7"}>
      { code === "ERR_NETWORK" ? <Image src={NoInternetFound} width={200} height={200} alt={"Error"} /> :  <Image src={ErrorPageImage} width={200} height={200} alt={"Error"} />}
      <div className={'flex flex-col justify-center items-center'}>
        <div>
          <Typography className={"w-full !text-lg text-center !mb-0.5"} color={"primary"}>
            {error.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="max-w-md !mb-4">
            {error.description}
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<HomeIcon className={'size-5 text-inherit'} />}
          onClick={handleHome}
        >
          Home
        </Button>
      </div>
    </div>
  );
}
