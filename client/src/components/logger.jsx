

export default function Logger({Object}) {
    return(
        <div className="text-xs text-gray-500 break-all bg-gray-100 p-2 rounded">
                    {JSON.stringify(Object)}
        </div>
    )
}