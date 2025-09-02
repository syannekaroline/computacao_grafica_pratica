// src/App.jsx

import React, { useState, useEffect, useRef,useCallback } from 'react'; // Corrigido os imports
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import TopMenu from './components/TopMenu/TopMenu';
import './App.css';

function App() {
    // --- ESTADO CENTRAL DA APLICAÇÃO ---
    const [activeSidebarMenu, setActiveSidebarMenu] = useState('ALGORITHMS');
    const [currentMode, setCurrentMode] = useState('SELECT_ALGORITHM');

    // --- Seção de Lógica do Redimensionamento ---
// COLE ESTE BLOCO CORRIGIDO NO LUGAR

// --- Seção de Lógica do Redimensionamento ---
    const [sidebarWidth, setSidebarWidth] = useState(280);
    const isResizingRef = useRef(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        isResizingRef.current = true;
    };

    // Definimos handleMouseMove com useCallback para otimização
    const handleMouseMove = useCallback((e) => {
        if (isResizingRef.current) {
            const newWidth = Math.min(Math.max(e.clientX, 240), 600);
            setSidebarWidth(newWidth);
            // O console.log que você adicionou pode ficar aqui para testar
            console.log("Arrastando! Nova largura:", newWidth);
        }
    }, []); // Array vazio, pois a função não depende de nenhum estado ou prop

    // Definimos handleMouseUp com useCallback
    const handleMouseUp = useCallback(() => {
        isResizingRef.current = false;
    }, []);

    // O useEffect agora só se preocupa em adicionar e remover os listeners
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]); // Depende das funções memoizadas    

    // --- Seção de Parâmetros dos Algoritmos ---
    const [parameters, setParameters] = useState({
        bresenham: {
            p1: { x: 1, y: 2 },
            p2: { x: 8, y: 5 },
            color: '#FF0000',
        },
        circle: {
            center: { x: 0, y: 0 },
            radius: 5,
            color: '#0000FF',
        },
        transform: {
            translateX: 0,
            translateY: 0,
            scale: 1,
            rotationAngle: 0,
            rotationPivot: { x: 0, y: 0 },
        }
    });

    const handleParameterChange = (algorithm, paramName, value) => {
        setParameters(prevParams => ({
            ...prevParams,
            [algorithm]: {
                ...prevParams[algorithm],
                [paramName]: value,
            },
        }));
    };

    // --- ESTRUTURA VISUAL / LAYOUT ---
    return (
        <div className="app-container">
            <TopMenu
                currentMode={currentMode}
                onModeChange={setCurrentMode}
            />
            <div className="main-content">
                <div style={{ width: `${sidebarWidth}px`, flexShrink: 0,backgroundColor: '#fff' }}>
                    <Sidebar
                        activeMenu={activeSidebarMenu}
                        onMenuChange={setActiveSidebarMenu}
                        currentMode={currentMode}
                        parameters={parameters}
                        onParameterChange={handleParameterChange}
                        onModeChange={setCurrentMode}
                    />
                </div>
                <div
                    className="resizer"
                    onMouseDown={handleMouseDown}
                />
                <Canvas
                    currentMode={currentMode}
                    parameters={parameters}
                />
            </div>
        </div>
    );
}

export default App;