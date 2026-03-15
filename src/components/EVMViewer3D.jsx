import { useLoader } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { useEffect, useState } from 'react';

export default function EVMModel({ url }) {
    const [model, setModel] = useState(null);

    // Safe load mechanism
    useEffect(() => {
        if (!url) return;

        try {
            const loader = new STLLoader();
            loader.load(url, (geometry) => {
                geometry.computeVertexNormals();
                setModel(geometry);
            }, undefined, (err) => {
                console.error("Failed to load STL:", err);
            });
        } catch (e) {
            console.error(e);
        }
    }, [url]);

    if (!model) return null;

    return (
        <Center>
            <mesh geometry={model}>
                <meshStandardMaterial
                    color="#00877C" /* TI Teal accent for hardware representation */
                    metalness={0.6}
                    roughness={0.4}
                />
            </mesh>
        </Center>
    );
}
