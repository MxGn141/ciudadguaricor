import { getPrismaClient } from '../config/prisma';

const editorialesData = [
  {
    titulo: "Un llamado a la unidad ciudadana",
    contenido: `En estos tiempos de transformación, es fundamental que como ciudadanos de Guárico nos mantengamos unidos en la búsqueda del progreso y el bienestar común. 

La historia de nuestro estado está marcada por la capacidad de sus habitantes para superar adversidades y construir un futuro próspero. Hoy, más que nunca, necesitamos esa misma determinación.

Es momento de que las instituciones, la sociedad civil y los ciudadanos trabajemos de la mano para fortalecer nuestra democracia, impulsar el desarrollo económico y garantizar que las próximas generaciones hereden una región próspera y justa.

La participación ciudadana activa, el diálogo constructivo y el compromiso con los valores democráticos son los pilares sobre los cuales debemos construir el Guárico del futuro.`,
    autor: "Consejo Editorial"
  },
  {
    titulo: "Educación: la clave del desarrollo regional",
    contenido: `La educación representa la herramienta más poderosa para el desarrollo de cualquier región. En Guárico, tenemos la responsabilidad de garantizar que nuestros jóvenes tengan acceso a una formación de calidad que les permita competir en un mundo globalizado.

Los desafíos son múltiples: infraestructura educativa, formación docente, acceso a tecnología y programas de becas y apoyo estudiantil. Sin embargo, también contamos con fortalezas significativas: una tradición educativa sólida, instituciones comprometidas y una comunidad que valora el conocimiento.

Es imperativo que autoridades, sector privado y sociedad civil trabajen coordinadamente para crear un sistema educativo que responda a las necesidades del siglo XXI. Solo así podremos formar ciudadanos preparados para liderar el desarrollo de nuestro estado.

La inversión en educación es una inversión en el futuro de Guárico.`,
    autor: "Consejo Editorial"
  },
  {
    titulo: "Desarrollo sostenible: el camino hacia el progreso",
    contenido: `El desarrollo económico y la protección del medio ambiente no son conceptos antagónicos. En Guárico, tenemos la oportunidad única de demostrar que es posible crecer económicamente mientras preservamos nuestros recursos naturales.

Nuestro estado cuenta con una riqueza natural extraordinaria: tierras fértiles, recursos hídricos abundantes y una biodiversidad que debe ser protegida para las futuras generaciones. El desafío está en aprovechar estos recursos de manera responsable y sostenible.

Las políticas públicas deben orientarse hacia la promoción de actividades económicas que generen empleo y riqueza sin comprometer el equilibrio ecológico. La agricultura sostenible, el turismo ecológico y las energías renovables son sectores con gran potencial de desarrollo.

Es responsabilidad de todos - gobierno, empresarios y ciudadanos - trabajar por un modelo de desarrollo que sea económicamente viable, socialmente justo y ambientalmente sostenible.`,
    autor: "Consejo Editorial"
  },
  {
    titulo: "La importancia del periodismo local",
    contenido: `En una era dominada por la información global, el periodismo local adquiere una relevancia especial. Los medios de comunicación regionales tienen la responsabilidad de informar sobre los temas que directamente afectan a nuestras comunidades.

El periodismo local no solo informa, sino que también fortalece la democracia al mantener a los ciudadanos informados sobre las decisiones que impactan su vida cotidiana. Es el puente entre las autoridades y la comunidad, el vigilante de la transparencia y el promotor del debate público constructivo.

En Guárico, necesitamos medios de comunicación independientes, profesionales y comprometidos con la verdad. Medios que investiguen, que cuestionen, que propongan y que contribuyan al desarrollo de una ciudadanía informada y participativa.

La libertad de prensa y el acceso a la información son derechos fundamentales que debemos proteger y promover. Solo con medios libres y responsables podremos construir una sociedad verdaderamente democrática.`,
    autor: "Consejo Editorial"
  }
];

async function seedEditoriales() {
  const prisma = getPrismaClient();
  
  try {
    console.log('🌱 Iniciando seed de editoriales...');
    
    // Limpiar editoriales existentes
    await prisma.editorial.deleteMany();
    
    // Crear editoriales
    for (const editorial of editorialesData) {
      const created = await prisma.editorial.create({
        data: editorial
      });
      console.log(`✅ Editorial creado: ${created.titulo}`);
    }
    
    console.log('🎉 Seed de editoriales completado exitosamente!');
    console.log(`📰 ${editorialesData.length} editoriales creados`);
    
  } catch (error) {
    console.error('❌ Error durante el seed de editoriales:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedEditoriales()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export default seedEditoriales;
