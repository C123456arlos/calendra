'use client'
import { Mosaic } from 'react-loading-indicators'
export default function Loading() {
    return (
        <div className='flex flex-col items-center justify-center animate-fade-in pt-16'>
            <Mosaic color={['#32cd32', '#32tfcd', '#cd32cd', '#cd8032']} size='large' text='loading' textColor='black'></Mosaic>
        </div>
    )
}