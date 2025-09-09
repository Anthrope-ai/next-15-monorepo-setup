/**
 * Layout component or module.
 */
import React from "react";
import Loader from "../../loaders/Loader.tsx";
import { Divider } from "@mui/material";
import { VerticalLayoutProps } from "@monorepo/types";
import EmptyPage from "../../pages/EmptyPage.tsx";
import ErrorPage from "../../pages/ErrorPage.tsx";

const VerticalLayout = ({
                          children,
                          isLoading,
                          error,
                          pageHeader,
                          sidebarComponents,
                          requireEmptyPage = false,
                          emptyPageMessage = "No data available",
                          dataLength,
                          enableDivider = false,
                          sidebarWidth = "350px",
                        }: VerticalLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-3 sm:gap-y-5">
      {pageHeader && (
        <div className={'!max-w-full md:max-w-auto mt-6'} style={{ width: `100%`, maxWidth: `calc(100% - ${sidebarWidth} - 1.75rem)` }}>{pageHeader}</div>
      )}
      {isLoading ? (
        <Loader />
      ) :  error ? ( error.code === 204 ? (
          <ErrorPage
            code = {error.code}
            title={error.message}
            description="Please check your internet connection and try again."
          /> ) : (
          <ErrorPage
            title="Something went wrong"
            description="An error occurred. Please try again later"
          />
        )
      ) : requireEmptyPage && dataLength === 0 ? (
        <EmptyPage title={emptyPageMessage} />
      ) : (
        <div className="w-full flex flex-col md:flex-row items-stretch gap-7">
          <div className="w-full md:flex-1 space-y-7">
            <div>{children}</div>
          </div>

          {enableDivider && (
            <div className="w-0.5 px-4 hidden md:block">
              <Divider orientation="vertical" />
            </div>
          )}

          <div
            className={`space-y-7 ${sidebarWidth ? "hidden md:block" : ""}`}
            style={{ width: `100%`, maxWidth: `min(100%, ${sidebarWidth})` }}
          >
            {sidebarComponents}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalLayout;