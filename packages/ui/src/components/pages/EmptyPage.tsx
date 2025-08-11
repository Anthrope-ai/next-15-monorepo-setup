/**
 * EmptyPage component or module.
 */
import React from 'react';
import Image from "next/image";
// @ts-ignore
import EmptyPageResume from "../../assets/illustrations/empty-page.svg";
import Typography from "@mui/material/Typography";

const EmptyPage = ({title}: {title: string}) => {
    return (
        <div className={'w-full flex flex-col h-[400px] space-y-5 justify-center items-center'}>
            <Image src={EmptyPageResume} width={170} height={170} alt={'Empty Candidates'}/>
            <Typography className={'w-full !text-lg text-center mt-4'} color={'primary'}>
                {title}
            </Typography>
        </div>
    );
};

export default EmptyPage;