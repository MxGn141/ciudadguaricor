import seedColumnistas from './seedColumnistas';
import seedEditoriales from './seedEditoriales';

async function seedAll() {
  console.log('🚀 Iniciando seed completo de la base de datos...');
  console.log('='.repeat(50));
  
  try {
    // Seed columnistas y opiniones
    await seedColumnistas();
    console.log('');
    
    // Seed editoriales
    await seedEditoriales();
    console.log('');
    
    console.log('🎉 ¡SEED COMPLETO EXITOSO!');
    console.log('='.repeat(50));
    console.log('✅ Base de datos poblada con:');
    console.log('   📊 5 columnistas con biografías y fotos');
    console.log('   📝 5 opiniones/columnas de ejemplo');
    console.log('   📰 4 editoriales institucionales');
    console.log('');
    console.log('🔗 Ahora puedes:');
    console.log('   1. Ir a /opinion/columnistas para ver los columnistas');
    console.log('   2. Ir a /opinion/editoriales para ver las editoriales');
    console.log('   3. Usar el panel de admin para gestionar contenido');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error durante el seed completo:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export default seedAll;
