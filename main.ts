let currentBlockIndex = 0
let allBlocks: string[] = []
let cmPerRotation = 0
let convertedRotations = 0
let lastBlockIndex = 0
let TargetLightValue = 0
let proportionalConstant = 0
let lightValue = 0
let steeringValue = 0
let findLineSpeed = 0
let displayBlockCounter = 0
let crawlSpeed = 0
let list: number[] = []
function updateBlockIndex (increment: boolean) {
    if (increment) {
        if (currentBlockIndex < allBlocks.length) {
            currentBlockIndex += 1
        } else {
            music.playSoundEffect(sounds.systemClick)
        }
    } else {
        if (currentBlockIndex > 1) {
            currentBlockIndex += -1
        } else {
            music.playSoundEffect(sounds.systemClick)
        }
    }
}
function convertCmToRotations (cm: number) {
    cmPerRotation = 13.345
    convertedRotations = cm / cmPerRotation
}
function turnDegrees (degrees: number, speed: number) {
    sensors.gyro2.reset()
    if (degrees < 0) {
        motors.largeBC.steer(-100, speed)
    } else {
        motors.largeBC.steer(100, speed)
    }
    sensors.gyro2.pauseUntilRotated(degrees)
}
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    incrementBlockIndex()
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    decrementBlockIndex()
})
function firstRun () {
	
}
function deliverModel () {
    proFollowLineCm(65, 20)
    proFollowLineCm(35, 0)
    proFollowLineCm(55, 7)
    turnDegrees(-40, 50)
    motors.mediumA.run(50)
}
function runCurrentBlock () {
    if (currentBlockIndex == 1) {
        firstRun()
    }
    if (currentBlockIndex == 2) {
        secondRun()
    }
}
function incrementBlockIndex () {
    updateBlockIndex(true)
    updateBlockDisplay()
}
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    runCurrentBlock()
    lastBlockIndex = currentBlockIndex
    incrementBlockIndex()
    if (currentBlockIndex == lastBlockIndex) {
        music.playSoundEffect(sounds.expressionsFanfare)
    }
})
function setupAllBlocks () {
    currentBlockIndex = 1
    allBlocks = ["First Run", "Second Run", "Step 3", "Step 4"]
    updateBlockDisplay()
}
function decrementBlockIndex () {
    updateBlockIndex(false)
    updateBlockDisplay()
}
function proFollowLinesRotations (speed: number, rotations: number) {
    motors.largeB.clearCounts()
    TargetLightValue = 25
    proportionalConstant = -0.4
    while (motors.largeB.angle() / 360 >= rotations) {
        lightValue = sensors.color3.light(LightIntensityMode.Reflected)
        steeringValue = (lightValue - TargetLightValue) * proportionalConstant
        motors.largeBC.steer(steeringValue, speed)
    }
    motors.largeBC.stop()
}
function secondRun () {
    motors.mediumA.setBrake(false)
    findLowerLine()
    deliverModel()
    slowPush()
}
function findLowerLine () {
    findLineSpeed = 50
    motors.largeB.run(findLineSpeed, 1.4, MoveUnit.Rotations)
    motors.largeBC.run(findLineSpeed, 1, MoveUnit.Rotations)
}
function proFollowLineCm (speed: number, cm: number) {
    convertCmToRotations(cm)
    proFollowLinesRotations(speed, convertedRotations)
}
function updateBlockDisplay () {
    brick.clearScreen()
    displayBlockCounter = 1
    for (let index = 0; index <= list.length - 1; index++) {
        if (currentBlockIndex == displayBlockCounter) {
            brick.showString("* " + allBlocks[index], index + 1)
        } else {
            brick.showString("  " + allBlocks[index], index + 1)
        }
        displayBlockCounter += 1
    }
}
function slowPush () {
    crawlSpeed = 5
    convertCmToRotations(25)
    motors.largeBC.run(-50, convertedRotations, MoveUnit.Rotations)
    turnDegrees(40, 50)
    motors.mediumA.run(-50, 0.18, MoveUnit.Rotations)
    convertCmToRotations(25)
    motors.largeBC.run(50, convertedRotations, MoveUnit.Rotations)
    convertCmToRotations(19)
    motors.largeBC.run(crawlSpeed, convertedRotations, MoveUnit.Rotations)
}
