import { useEffect } from 'react'
import { useRecord } from '../Hooks/useRecord';

export const Last3Record = ({ bandera }) => {


    const { fetchLastThree, lastThree } = useRecord();

    const ocultarDNI = (dni) => {
        return `••${dni.slice(-4)}`
    };


    useEffect(() => {
        fetchLastThree();
    }, [bandera]);
    return (

        lastThree.length > 0 && (
            <div className="my-2 w-1/3 mx-auto flex flex-col justify-center items-center">
                <h2 className="mb-4 text-lg font-semibold text-gray-700 text-center">Últimos fichajes registrados</h2>
                <div className="flex flex-col gap-4">
                    {lastThree.map((item) => (
                        <div key={item.id} className="bg-white/60 shadow-sm rounded-lg p-4 backdrop-blur-md w-fit">
                            <div className="flex justify-start gap-4 items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <p className="text-sm text-gray-800"><strong>DNI: </strong> {ocultarDNI(item.dni)}</p>
                                <p className="text-sm text-gray-800"><strong>Registro:</strong> {item.timestampFormatted}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )

    )
}
