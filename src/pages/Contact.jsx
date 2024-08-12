import { useNavigate } from 'react-router-dom';

export default function AboutMe(){
  const navigate = useNavigate()
  
  const handleNavigation = () => {
    navigate(`/success-association`)
    
  }

  return (
    <div>
      <button onClick={handleNavigation}>
        Success-association
      </button>
      <h3>Desde Contact</h3>
    </div>
  )
}