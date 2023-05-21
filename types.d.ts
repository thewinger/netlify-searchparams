import { Image } from "sanity";

type FrontPage = {
  featured: Featured[];
  latest: Propiedad[];
};

type Featured = {
  title: string;
  slug: string;
  coverImage: Image;
  tipo: string;
  operacion: string;
};

type Propiedad = {
  _id: string;
  title: string;
  slug: string;
  bathrooms: string;
  bedrooms: string;
  localizacion: string;
  localizacionPadre?: Parent;
  tipo: string;
  price: string;
  operacion: FilterString;
  coverImage: Image;
  images?: Image[];
  caracteristicas?: { title: string }[];
  description?: string;
  size?: number;
  year?: number;
};

type Dict = {
  header: {
    email: string;
    telefono: string;
    lang_switcher: string;
  };
  slogan: string;
  destacados: string;
  ultimos_anadidos: string;
  contactar_button: string;
  alquiler_tag: string;
  footer: {
    quienes_somos: {
      quienes_somos_label: string;
      quienes_somos_text: string;
      aviso_legal_label: string;
    };
    contacto: {
      contacto_label: string;
      horario: string;
    };
  };
  filters: {
    filtros_title: string;
    search_button: string;
    tipo_label: string;
    tipo_allValue: string;
    tipo_placeholder: string;
    localizacion_label: string;
    localizacion_allValue: string;
    localizacion_placeholder: string;
    precioMin_label: string;
    precioMax_label: string;
    banos_label: string;
    habitaciones_label: string;
  };
};
