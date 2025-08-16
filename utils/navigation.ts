import { router } from 'expo-router';

export class NavigationHelper {
  
  /**
   * Navigate to main menu
   */
  static toMainMenu() {
    router.replace('/');
  }

  /**
   * Navigate to character creation screen
   */
  static toCharacterCreation() {
    router.push('/character-creation');
  }

  /**
   * Navigate to game screen
   */
  static toGame() {
    router.push('/game');
  }

  /**
   * Go back to previous screen
   */
  static goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  /**
   * Replace current screen with new one
   */
  static replace(href: string) {
    router.replace(href);
  }

  /**
   * Push new screen to stack
   */
  static push(href: string) {
    router.push(href);
  }

  /**
   * Check if can go back
   */
  static canGoBack(): boolean {
    return router.canGoBack();
  }

  /**
   * Reset navigation stack and go to specific screen
   */
  static reset(href: string) {
    router.dismissAll();
    router.replace(href);
  }

  /**
   * Navigate to game with character data
   */
  static startGame(characterData?: any) {
    // Store character data in global state before navigation
    router.push({
      pathname: '/game',
      params: characterData ? { characterData: JSON.stringify(characterData) } : {}
    });
  }

  /**
   * Exit game and return to main menu
   */
  static exitGame() {
    router.dismissAll();
    router.replace('/');
  }
}

export default NavigationHelper;