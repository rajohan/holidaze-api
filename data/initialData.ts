import { Contact } from "../api/models/Contact";
import { Establishment } from "../api/models/Establishment";
import { Enquiry } from "../api/models/Enquiry";
import { User } from "../api/models/User";
import bcrypt from "bcrypt";

const establishments = [
    {
        name: "Sunset Beach",
        email: "info@sunsetbeach.com",
        imageUrl:
            "https://images.unsplash.com/photo-1439130490301-25e322d88054?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 85,
        maxGuests: 18,
        googleLat: 60.393388,
        googleLong: 5.22872,
        description:
            "Get ready for some amazing sunsets as you sip a cocktail and watch dolphins play in the harbour below.",
        selfCatering: true
    },
    {
        name: "Rest Easy",
        email: "management@resteasy.com",
        imageUrl:
            "https://images.unsplash.com/photo-1512552288940-3a300922a275?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 120,
        maxGuests: 14,
        googleLat: 60.396779,
        googleLong: 5.235602,
        description:
            "Need some time off from your busy life to relax and unwind? Choose Rest Easy for the complete relaxation experience you desire.",
        selfCatering: false
    },
    {
        name: "The Hideaway",
        email: "info@hideaway.com",
        imageUrl:
            "https://images.unsplash.com/photo-1551906993-c8b38a6ab201?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 70,
        maxGuests: 2,
        googleLat: 60.425168,
        googleLong: 5.358141,
        description: "This secluded wilderness cabin is the perfect spot for a restful and cosy getaway.",
        selfCatering: true
    },
    {
        name: "Farm Cottage",
        email: "info@cottageholidays.com",
        imageUrl:
            "https://images.unsplash.com/photo-1505916349660-8d91a99c3e23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 100,
        maxGuests: 8,
        googleLat: 60.42175,
        googleLong: 5.371878,
        description:
            "Voted the best B&B in Norway, this farm cottage is available for family holidays throughout the summer.",
        selfCatering: false
    },
    {
        name: "Tree Tops",
        email: "enquiries@treetops.com",
        imageUrl:
            "https://images.unsplash.com/photo-1550355191-aa8a80b41353?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=600&h=337&auto=format&fit=crop&crop=focal&fp-y=0.4&fp-x=0.5&q=80",
        price: 95.0,
        maxGuests: 6,
        googleLat: 60.405482,
        googleLong: 5.352511,
        description:
            "For a getaway like no other, this unique treehouse offers a cosy and comfortable wilderness experience.",
        selfCatering: true
    },
    {
        name: "Coast to Coast",
        email: "enquiries@coasttocoast.com",
        imageUrl:
            "https://images.unsplash.com/photo-1544085701-4d54e9f41c45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 55,
        maxGuests: 4,
        googleLat: 60.397053,
        googleLong: 5.322961,
        description: "This trendy apartment in the heart of the city is the perfect base from which to explore Bergen.",
        selfCatering: true
    },
    {
        name: "Koselig hytte Spa Resort",
        email: "info@koselighyttespa.no",
        imageUrl:
            "https://images.unsplash.com/photo-1469394576569-858815b13427?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 105,
        maxGuests: 4,
        googleLat: 60.487134,
        googleLong: 5.353859,
        description:
            "A beautiful lakeside retreat where you can relax, unwind and explore the beauty of the natural world.",
        selfCatering: false
    },
    {
        name: "City Break",
        email: "info@citybreakapartment.no",
        imageUrl:
            "https://images.unsplash.com/photo-1509365390695-33aee754301f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 60,
        maxGuests: 2,
        googleLat: 60.390076,
        googleLong: 5.318007,
        description:
            "If you're in Bergen on business or for a holiday, this cosy and classy apartment is the perfect place to stay.",
        selfCatering: true
    },
    {
        name: "Fjell Hotel",
        email: "desk@fjellhotel.com",
        imageUrl:
            "https://images.unsplash.com/photo-1501117716987-c8c394bb29df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 160,
        maxGuests: 4,
        googleLat: 60.353245,
        googleLong: 5.118213,
        description:
            "For a restful and relaxing trip, come visit our luxurious boutique hotel, with views of the sea from all our rooms",
        selfCatering: false
    },
    {
        name: "Glede Mountain Lodge",
        email: "enquiries@gledemountain.no",
        imageUrl:
            "https://images.unsplash.com/photo-1517320964276-a002fa203177?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=600&h=337&auto=format&fit=crop&crop=focal&fp-y=1&fp-x=1&q=80",
        price: 110,
        maxGuests: 6,
        googleLat: 60.406214,
        googleLong: 5.37656,
        description:
            "A luxury hotel nestled in the mountains. Our award winning chef will cater for your every desire.",
        selfCatering: false
    },
    {
        name: "Home from Home",
        email: "info@homefromhome.com",
        imageUrl:
            "https://images.unsplash.com/photo-1546555648-fb7876c40c58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 80,
        maxGuests: 10,
        googleLat: 60.345025,
        googleLong: 5.304774,
        description:
            "A large and tastefully decorated home away from home. Perfect for bigger families or groups of friends.",
        selfCatering: true
    },
    {
        name: "Lodge Hotel",
        email: "info@lodgehotel.com",
        imageUrl:
            "https://images.unsplash.com/photo-1548873902-8b69fb85030a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=600&h=337&fit=crop&auto=format&q=80&crop=focal&fp-x=0.7&fp-y=0.7",
        price: 75,
        maxGuests: 20,
        googleLat: 60.311531,
        googleLong: 5.46815,
        description:
            "A family-friendly lodge with beautiful, well-appointed rooms. Located in a stunning valley close to winter sports facilities.",
        selfCatering: false
    },
    {
        name: "The Shed",
        email: "enquiries@theshedaccomodation.no",
        imageUrl:
            "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        price: 50,
        maxGuests: 2,
        googleLat: 60.335076,
        googleLong: 5.406012,
        description:
            "A rustic and cosy rural cottage, perfect for romantic weekends away and quiet retreats into nature.",
        selfCatering: true
    },
    {
        name: "Innsjø Hus",
        email: "enquiries@innsjøhus.no",
        imageUrl:
            "https://images.unsplash.com/photo-1469394576569-858815b13427?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 200,
        maxGuests: 8,
        googleLat: 61.084654,
        googleLong: 6.228147,
        description:
            "Located on the banks of a beautiful and idyllic lake, this large and luxurious home is perfect for a rural getaway.",
        selfCatering: true
    },
    {
        name: "Peace and Quiet",
        email: "enquiries@peaceandquiet.no",
        imageUrl:
            "https://images.unsplash.com/photo-1479123142480-cbdc7b84de24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 150,
        maxGuests: 10,
        googleLat: 60.374245,
        googleLong: 6.200421,
        description: "A large and welcoming lake house retreat in the heart of a beautiful valley.",
        selfCatering: true
    },
    {
        name: "Adam's Place",
        email: "enquiries@adamsplace.no",
        imageUrl:
            "https://images.unsplash.com/photo-1507038772120-7fff76f79d79?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        price: 60,
        maxGuests: 3,
        googleLat: 60.383708,
        googleLong: 5.364432,
        description: "Rest, relax and explore Bergen from this beautiful home in a quiet neighbourhood.",
        selfCatering: true
    },
    {
        name: "Buena Vista",
        email: "info@buenavista.com",
        imageUrl:
            "https://images.unsplash.com/photo-1523791633495-94ebabc8a795?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80",
        price: 45,
        maxGuests: 6,
        googleLat: 60.374416,
        googleLong: 5.19431,
        description:
            "With wonderful views of the surrounding area, and a host who is passionate about the area, Buena Vista is a must for those looking for an authentic experience at a reasonable price.",
        selfCatering: false
    }
];

const enquiries = (establishment: { establishmentId: string }, user: { userId: string; name: string }): [{}] => [
    {
        establishmentId: establishment.establishmentId,
        userId: user.userId,
        clientName: user.name,
        guests: 4,
        checkin: new Date(2019, 5, 3),
        checkout: new Date(2019, 5, 5)
    }
];

const contact = [
    {
        clientName: "Susan Lispinsky",
        email: "susanl@gmail.com",
        message: "I'd like to add my establishment to the website please."
    },
    {
        clientName: "Marie Debussey",
        email: "mariedub@outlook.com",
        message: "Hello. I'd like to cancel a booking. Can you assist me?"
    },
    {
        clientName: "Vegard Andersen",
        email: "vegard@gmail.com",
        message: "Hello. I didn't enjoy the last place I stayed at and would like to make a complaint."
    }
];

const generatePassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const users = async (): Promise<{}[]> => [
    {
        username: "holidaze",
        password: await generatePassword("admin123"),
        email: "mail@holidaze.com",
        name: "Holidaze Admin",
        accessLevel: 2
    },
    {
        username: "rajohan",
        password: await generatePassword("test123"),
        email: "rajohan1@gmail.com",
        name: "Raymond Johannessen"
    }
];

const insertInitialData = async (): Promise<void> => {
    const userData = await users();

    const createdEstablishments = await Establishment.bulkCreate(establishments);
    const createdUsers = await User.bulkCreate(userData);
    await Enquiry.bulkCreate(
        enquiries(
            { establishmentId: createdEstablishments[0].getDataValue("id") },
            { userId: createdUsers[1].getDataValue("id"), name: createdUsers[1].getDataValue("name") }
        )
    );
    await Contact.bulkCreate(contact);

    console.log("Initial data inserted to the database");
};

export { insertInitialData };
