<template>
  <footer class="bg-dark-950 border-t border-dark-800 mt-20">
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo y descripción -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Scissors class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-display font-bold text-white">
              Kings<span class="text-primary-500">Cutz</span>
            </span>
          </div>
          <p class="text-gray-400 text-sm">
            La barbería donde el estilo se encuentra con la tradición. 
            Expertos en cortes clásicos y modernos.
          </p>
        </div>

        <!-- Enlaces rápidos -->
        <div>
          <h3 class="text-white font-display font-semibold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Inicio
              </router-link>
            </li>
            <li>
              <router-link to="/servicios" class="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Servicios
              </router-link>
            </li>
            <li>
              <router-link to="/productos" class="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Productos
              </router-link>
            </li>
            <li>
              <router-link to="/agendar" class="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Agendar Cita
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h3 class="text-white font-display font-semibold mb-4">Contacto</h3>
          <ul class="space-y-2">
            <li class="flex items-center space-x-2 text-gray-400 text-sm">
              <MapPin class="w-4 h-4 text-primary-500" />
              <span>Calle Principal #123</span>
            </li>
            <li class="flex items-center space-x-2 text-gray-400 text-sm">
              <Phone class="w-4 h-4 text-primary-500" />
              <span>+57 300 123 4567</span>
            </li>
            <li class="flex items-center space-x-2 text-gray-400 text-sm">
              <Mail class="w-4 h-4 text-primary-500" />
              <span>info@TheBunker.com</span>
            </li>
          </ul>
        </div>

        <!-- Horarios -->
        <div>
          <h3 class="text-white font-display font-semibold mb-4">Horarios</h3>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li class="flex justify-between">
              <span>Lunes - Viernes:</span>
              <span class="text-primary-500">9AM - 8PM</span>
            </li>
            <li class="flex justify-between">
              <span>Sábado:</span>
              <span class="text-primary-500">9AM - 6PM</span>
            </li>
            <li class="flex justify-between">
              <span>Domingo:</span>
              <span class="text-primary-500">10AM - 4PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-dark-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 TheBunker. Todos los derechos reservados.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-primary-500 transition-colors">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-500 transition-colors">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-500 transition-colors">
              <Twitter class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter 
} from 'lucide-vue-next'
</script>
