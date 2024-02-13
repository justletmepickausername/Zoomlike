export class UserData 
{
    public Id: any;
    public Username: string = "";
    public Password: string = "";
    public Email: string = "";
    public UserType: string = "";
    public fullName: string = "";
    public parentName: string = "";
    public parentNumber: string = "";
}

export class ClassData
{
    public Id: any;
    public ClassName: string = "";
    public DayOfTheWeek: string = "";
    public StartHour: string = "";
    public EndHour: string = "";
    public Students: string[] = [];
    public Teacher: string = "";
    public DefaultWhiteboard: string = "";
    public DefaultMicrophoneState: string = "";
    public DefaultCameraState: string = "";
}

export class ShapeData
{
    public shapeType: string = "";
    public points: any = [];
    public color: string = "";
    public thickness: number = 2;
    public text: string = "";
}
