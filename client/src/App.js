import './App.scss';
import InputForm from './InputForm';
function App() {
  return (
    <div className="main-content">
      <div className='top-content-container'>
      <p className='main-content-text'>
          Peaking Duck&nbsp;• Refer a friend
        </p>
      </div>
      <div className='main-content-container'>
        <InputForm/>
      </div>
    </div>
  );
}

export default App;
