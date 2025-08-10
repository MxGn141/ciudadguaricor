import { getPrismaClient } from '../config/prisma';

const columnistasData = [
  {
    nombre: "María González",
    bio: "Periodista especializada en política y análisis social con más de 15 años de experiencia en medios regionales. Licenciada en Comunicación Social por la Universidad Central de Venezuela.",
    fotoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face",
    redes: {
      twitter: "@mariagonzalez",
      email: "maria.gonzalez@ciudadguarico.com"
    }
  },
  {
    nombre: "Carlos Rodríguez",
    bio: "Analista económico y columnista de opinión enfocado en temas de desarrollo regional y políticas públicas. Magíster en Economía por la Universidad Católica Andrés Bello.",
    fotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    redes: {
      twitter: "@carlosrodriguez",
      linkedin: "carlos-rodriguez-economista"
    }
  },
  {
    nombre: "Ana Martínez",
    bio: "Escritora y columnista cultural, especialista en literatura latinoamericana y crítica de arte contemporáneo. Doctora en Letras por la Universidad de Los Andes.",
    fotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    redes: {
      twitter: "@anamartinez",
      instagram: "@ana.martinez.cultura"
    }
  },
  {
    nombre: "Luis Herrera",
    bio: "Periodista deportivo y analista de fútbol venezolano con amplia trayectoria en medios nacionales. Especialista en coberturas de eventos deportivos internacionales.",
    fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    redes: {
      twitter: "@luisherrera",
      youtube: "Luis Herrera Deportes"
    }
  },
  {
    nombre: "Carmen Silva",
    bio: "Especialista en temas sociales y derechos humanos, columnista comprometida con la justicia social. Abogada y activista con 20 años de experiencia en ONGs.",
    fotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    redes: {
      twitter: "@carmensilva",
      email: "carmen.silva@ciudadguarico.com"
    }
  }
];

// Las opiniones se crearán dinámicamente después de crear los columnistas

async function seedColumnistas() {
  const prisma = getPrismaClient();
  
  try {
    console.log('🌱 Iniciando seed de columnistas...');
    
    // Limpiar datos existentes
    await prisma.opinion.deleteMany();
    await prisma.columnista.deleteMany();
    
    // Crear columnistas y guardar sus IDs
    const columnistasCreados = [];
    for (const columnista of columnistasData) {
      const created = await prisma.columnista.create({
        data: {
          ...columnista,
          redes: columnista.redes
        }
      });
      columnistasCreados.push(created);
      console.log(`✅ Columnista creado: ${created.nombre} (ID: ${created.id})`);
    }
    
    // Crear opiniones usando los IDs reales de los columnistas
    const opinionesData = [
      {
        titulo: "El futuro de la democracia en Venezuela",
        contenido: "En los últimos años, hemos sido testigos de transformaciones significativas en el panorama político venezolano. La participación ciudadana se ha convertido en un elemento clave para la construcción de una sociedad más justa y equitativa. Es fundamental que como ciudadanos mantengamos un compromiso activo con los procesos democráticos, participando no solo en las elecciones, sino también en los espacios de deliberación pública que nos permiten construir consensos sobre los grandes temas nacionales.",
        columnistaId: columnistasCreados[0].id,
        destacado: true
      },
      {
        titulo: "Análisis económico: perspectivas para 2025",
        contenido: "La economía regional muestra signos de recuperación gradual. Los indicadores macroeconómicos sugieren una estabilización que podría traducirse en mejores oportunidades para el desarrollo local. Sin embargo, es crucial que las políticas públicas se enfoquen en crear un entorno propicio para la inversión productiva, el emprendimiento y la generación de empleo de calidad. La diversificación económica debe ser una prioridad para reducir la dependencia de sectores tradicionales.",
        columnistaId: columnistasCreados[1].id,
        destacado: false
      },
      {
        titulo: "Arte y cultura en tiempos de cambio",
        contenido: "La expresión artística ha encontrado nuevos canales en la era digital. Los artistas locales están aprovechando las plataformas tecnológicas para difundir su trabajo y conectar con audiencias globales. Esta transformación digital del sector cultural presenta oportunidades únicas para la proyección internacional de nuestros valores y tradiciones, al tiempo que permite la experimentación con nuevas formas de expresión que dialogan con las tendencias contemporáneas.",
        columnistaId: columnistasCreados[2].id,
        destacado: true
      },
      {
        titulo: "El deporte como herramienta de integración social",
        contenido: "Las disciplinas deportivas han demostrado ser un vehículo efectivo para la cohesión social. En Guárico, los programas deportivos comunitarios están generando impactos positivos en la juventud, promoviendo valores como el trabajo en equipo, la disciplina y el respeto. Es fundamental que las autoridades locales continúen invirtiendo en infraestructura deportiva y programas de formación que permitan el desarrollo integral de nuestros jóvenes atletas.",
        columnistaId: columnistasCreados[3].id,
        destacado: false
      },
      {
        titulo: "Derechos humanos: avances y desafíos",
        contenido: "La protección de los derechos fundamentales requiere un esfuerzo conjunto de instituciones y sociedad civil. Es fundamental fortalecer los mecanismos de protección y garantía de estos derechos, especialmente en lo que respecta a los grupos más vulnerables de nuestra sociedad. La educación en derechos humanos debe ser una prioridad en todos los niveles educativos para formar ciudadanos conscientes de sus derechos y responsabilidades.",
        columnistaId: columnistasCreados[4].id,
        destacado: true
      }
    ];
    
    // Crear las opiniones
    for (const opinion of opinionesData) {
      const created = await prisma.opinion.create({
        data: opinion
      });
      console.log(`📝 Opinión creada: ${created.titulo}`);
    }
    
    console.log('🎉 Seed completado exitosamente!');
    console.log(`📊 ${columnistasData.length} columnistas creados`);
    console.log(`📝 ${opinionesData.length} opiniones creadas`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedColumnistas()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export default seedColumnistas;
