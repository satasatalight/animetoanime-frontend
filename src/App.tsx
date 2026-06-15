import { useEffect, useState } from 'react'
import Home from './Home.tsx';

function App() {
  const [page, setPage] = useState(<></>);

  useEffect(() => {
    setPage(<Home setPage={setPage}/>);}, [setPage]);

  return (
    <section className='flex justify-center flex-col bg-linear-to-t from-slate-950 to-slate-900 h-dvh'>
      <div className='max-w-5xl place-self-center'>
        {page}
      </div>
    </section>
  );
}

export default App
