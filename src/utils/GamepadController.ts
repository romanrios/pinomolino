export class GamepadController {
    private static gamepadIndex: number | null = null;

    public static initialize(): void {
        window.addEventListener("gamepadconnected", (event) => {
            console.log("Gamepad conectado:", event.gamepad);
            GamepadController.gamepadIndex = event.gamepad.index;
        });

        window.addEventListener("gamepaddisconnected", () => {
            console.log("Gamepad desconectado");
            GamepadController.gamepadIndex = null;
        });
    }

    public static getJoystickDirection(): { x: number, y: number } | null {
        const gamepad = GamepadController.getGamepad();
        if (gamepad) {
            return { x: gamepad.axes[0], y: gamepad.axes[1] };
        }
        return null;
    }

    public static isButtonPressed(buttonIndex: number): boolean {
        const gamepad = GamepadController.getGamepad();
        if (gamepad && gamepad.buttons[buttonIndex] !== undefined) {
            return gamepad.buttons[buttonIndex].pressed;
        }
        return false;
    }

    private static getGamepad(): Gamepad | null {
        if (GamepadController.gamepadIndex !== null) {
            return navigator.getGamepads()[GamepadController.gamepadIndex];
        }
        return null;
    }
}
    