/**
 * Layout component or module.
 */
'use client'

import React from "react";
import Loader from "../../loaders/Loader.tsx";
import EmptyPage from "../../pages/EmptyPage.tsx";
import { HorizontalLayoutProps } from "@monorepo/types";
import ErrorPage from "../../pages/ErrorPage.tsx";


const HorizontalLayout = ({
                            children,
                            isLoading,
                            error,
                            pageHeader,
                            requireEmptyPage = false,
                            emptyPageMessage = "No data available",
                            dataLength,
                          }: HorizontalLayoutProps) => {
  return (
    <div className={"w-full space-y-3 sm:space-y-5"}>
      {pageHeader ? <div className={'mt-6'}>{pageHeader}</div> : <></>}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorPage
          code={error.code}
          title="Something went wrong"
          description="An error occurred. Please try again later"
        />
      ) : requireEmptyPage && dataLength === 0 ? (
        <EmptyPage title={emptyPageMessage} />
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export default HorizontalLayout;