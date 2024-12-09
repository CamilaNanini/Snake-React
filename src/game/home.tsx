import React from 'react';
import {useNavigate} from "react-router-dom";
import { Button } from '../components/ui/button';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const goToGame = (difficulty:string) => {
      navigate(`/game/${difficulty}`);
    };
    
    return (
        <div>
            <h1 className='font-mono m-2'>Select a difficulty</h1>
            <div className='flex flex-col gap-4'>
                <Button className='font-black tracking-wider text-pink-500' onClick={() => goToGame("Easy")}>Easy</Button>
                <Button className='font-black tracking-wider text-pink-500' onClick={() => goToGame("Medium")}>Medium</Button>
                <Button className='font-black tracking-wider text-pink-500' onClick={() => goToGame("Hard")}>Hard</Button>
            </div>
        </div>
    );
};

export default Home;