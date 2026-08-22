

const Logo = () =>
{
  return (
    <div className='w-1/2 m-auto text-center'>
      <a href='/' aria-label="Ir a la página principal">
      <img
        src='/logo/mesaFlow_circular_logo.png' // Cambiar a webp
        alt='Logo MesaFlow'
        width='120'
        height='120'
        className='h-auto m-auto rounded-full'
        title='Logo MesaFlow'
      />
      </a>
    </div>
  );
};

export default Logo;
