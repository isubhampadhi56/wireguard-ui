export function InputBox<T extends string | number>({
  data,
  setData,
  label,
  darkMode = false
}: {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  label: string;
  darkMode?: boolean;
}) {
    return (
        <>
        <label className={`block font-medium mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>{label}</label>
            <input 
              className={`w-full border rounded px-3 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              value={data as string | number} 
              onChange={(e) => setData(e.target.value as T)} 
            />
    </>
    )
}
