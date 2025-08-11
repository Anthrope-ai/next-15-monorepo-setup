import React from "react";

export type HorizontalLayoutProps = {
  /*
  * The content to be displayed in the layout
   */
  children?: React.ReactNode;

  /*
  * The page header to be displayed
   */
  pageHeader?: React.ReactNode;

  /*
  * The loading state of the layout
   */
  isLoading?: boolean;

  /*
 * The error state of the layout
 */
  error?: any;

  /*
  * Do you need Empty Page Card to be displayed
   */
  requireEmptyPage?: boolean;

  /*
  * The message to be displayed in the empty page card
   */
  emptyPageMessage?: string;

  /*
  * The length of the data
   */
  dataLength?: number;
};