<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Background with overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950"></div>
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c17e3e\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container-custom text-center fade-in">
        <div class="inline-block mb-6 px-6 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full">
          <span class="text-primary-500 font-semibold uppercase text-sm tracking-wider">
            Barbería Profesional
          </span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-display font-bold text-white mb-6 text-shadow">
          Kings<span class="text-primary-500">Cutz</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Donde el <span class="text-primary-500 font-semibold">estilo</span> se encuentra 
          con la <span class="text-primary-500 font-semibold">tradición</span>
        </p>
        
        <p class="text-gray-400 mb-12 max-w-xl mx-auto">
          Expertos en cortes clásicos y modernos. Agenda tu cita hoy y 
          experimenta el servicio de barbería de clase mundial.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/agendar" class="btn-primary text-lg px-8 py-4">
            <div class="flex items-center justify-center space-x-2">
              <Calendar class="w-5 h-5" />
              <span>Agendar Cita</span>
            </div>
          </router-link>
          <router-link to="/servicios" class="btn-secondary text-lg px-8 py-4">
            Ver Servicios
          </router-link>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown class="w-8 h-8 text-primary-500" />
      </div>
    </section>

    <!-- Servicios destacados -->
    <section class="py-20 bg-dark-900">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Nuestros Servicios
          </h2>
          <p class="text-gray-400 text-lg">
            Calidad premium en cada corte
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card hover:shadow-glow-lg transition-all duration-300 group cursor-pointer">
            <div class="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scissors class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-display font-bold text-white mb-3">
              Corte Clásico
            </h3>
            <p class="text-gray-400 mb-4">
              El corte tradicional perfeccionado con técnicas modernas.
            </p>
            <p class="text-primary-500 font-bold text-xl">Desde $25.000</p>
          </div>

          <div class="card hover:shadow-glow-lg transition-all duration-300 group cursor-pointer">
            <div class="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-display font-bold text-white mb-3">
              Barba & Afeitado
            </h3>
            <p class="text-gray-400 mb-4">
              Cuidado profesional de barba con productos premium.
            </p>
            <p class="text-primary-500 font-bold text-xl">Desde $20.000</p>
          </div>

          <div class="card hover:shadow-glow-lg transition-all duration-300 group cursor-pointer">
            <div class="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Crown class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-display font-bold text-white mb-3">
              Paquete Royal
            </h3>
            <p class="text-gray-400 mb-4">
              Experiencia completa: corte, barba y masaje facial.
            </p>
            <p class="text-primary-500 font-bold text-xl">Desde $50.000</p>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link to="/servicios" class="btn-primary">
            Ver Todos los Servicios
          </router-link>
        </div>
      </div>
    </section>

    <!-- ¿Por qué elegirnos? -->
    <section class="py-20 bg-dark-950">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            ¿Por Qué TheBunker?
          </h2>
          <p class="text-gray-400 text-lg">
            La excelencia en cada detalle
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award class="w-10 h-10 text-primary-500" />
            </div>
            <h3 class="text-xl font-display font-bold text-white mb-2">
              Barberos Expertos
            </h3>
            <p class="text-gray-400">
              Profesionales certificados con años de experiencia
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star class="w-10 h-10 text-primary-500" />
            </div>
            <h3 class="text-xl font-display font-bold text-white mb-2">
              Productos Premium
            </h3>
            <p class="text-gray-400">
              Solo usamos las mejores marcas del mercado
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock class="w-10 h-10 text-primary-500" />
            </div>
            <h3 class="text-xl font-display font-bold text-white mb-2">
              Horarios Flexibles
            </h3>
            <p class="text-gray-400">
              Abierto 7 días a la semana para tu comodidad
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck class="w-10 h-10 text-primary-500" />
            </div>
            <h3 class="text-xl font-display font-bold text-white mb-2">
              Higiene Total
            </h3>
            <p class="text-gray-400">
              Máximos estándares de limpieza y desinfección
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-20 bg-gradient-primary">
      <div class="container-custom text-center">
        <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          ¿Listo para un Nuevo Look?
        </h2>
        <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Agenda tu cita ahora y recibe un 10% de descuento en tu primera visita
        </p>
        <router-link to="/agendar" class="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-2xl">
          <div class="flex items-center space-x-2">
            <Calendar class="w-5 h-5" />
            <span>Agendar Ahora</span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  Scissors, 
  Calendar, 
  ChevronDown, 
  Sparkles, 
  Crown, 
  Award, 
  Star, 
  Clock, 
  ShieldCheck 
} from 'lucide-vue-next'
</script>
