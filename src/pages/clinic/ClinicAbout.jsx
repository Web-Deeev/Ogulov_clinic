import Header from '../../components/common/Header/Header'
import ClinicBanner from '../../components/clinic/ClinicBanner/ClinicBanner'
import MethodsSlider from '../../components/clinic/MethodsSlider/MethodsSlider'
import AboutClinic from '../../components/clinic/AboutClinic/AboutClinic'

import './clinic.css';

export default function ClinicAbout() {
  return (
    <>
      <Header />
      <ClinicBanner />
      <MethodsSlider />
      <AboutClinic />
    </>
  );
}